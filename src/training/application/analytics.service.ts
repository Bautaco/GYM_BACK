import { Injectable, Inject, Optional, ForbiddenException } from '@nestjs/common';
import {
  IWorkoutSessionRepository,
  WORKOUT_SESSION_REPOSITORY_TOKEN,
} from '../domain/workout-session.repository.interface.js';
import {
  ITrainingPlanRepository,
  TRAINING_PLAN_REPOSITORY_TOKEN,
} from '../domain/training-plan.repository.interface.js';
import {
  IExerciseRepository,
  EXERCISE_REPOSITORY_TOKEN,
} from '../domain/exercise.repository.interface.js';
import {
  IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../users/domain/user.repository.interface.js';
import {
  IBodyWeightRepository,
  BODY_WEIGHT_REPOSITORY_TOKEN,
} from '../domain/body-weight.repository.interface.js';
import {
  IRoutineTemplateRepository,
  ROUTINE_TEMPLATE_REPOSITORY_TOKEN,
} from '../domain/routine-template.repository.interface.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';

export interface AdminOverviewFilters {
  period?: 'all' | '30d' | '90d' | '365d';
  startDate?: string;
  endDate?: string;
  trainerId?: string;
  adherenceRange?: 'all' | 'green' | 'yellow' | 'red';
}

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(WORKOUT_SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepo: IWorkoutSessionRepository,
    @Inject(TRAINING_PLAN_REPOSITORY_TOKEN)
    private readonly planRepo: ITrainingPlanRepository,
    @Inject(EXERCISE_REPOSITORY_TOKEN)
    private readonly exerciseRepo: IExerciseRepository,
    @Optional()
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo?: IUserRepository,
    @Optional()
    @Inject(BODY_WEIGHT_REPOSITORY_TOKEN)
    private readonly bodyWeightRepo?: IBodyWeightRepository,
    @Optional()
    @Inject(ROUTINE_TEMPLATE_REPOSITORY_TOKEN)
    private readonly templateRepo?: IRoutineTemplateRepository,
  ) {}

  async validateAthleteAccess(
    athleteId: string,
    user?: { id: string; role: string },
  ): Promise<void> {
    if (!user) return;
    if (user.role === UserRole.ADMIN) {
      return;
    }
    if (user.role === UserRole.ATLETA) {
      if (user.id !== athleteId) {
        throw new ForbiddenException(
          'No tienes permisos para consultar las métricas de otro atleta.',
        );
      }
      return;
    }
    if (user.role === UserRole.ENTRENADOR) {
      if (!this.userRepo) return;
      const athlete = await this.userRepo.findById(athleteId);
      if (athlete && athlete.trainerId && athlete.trainerId !== user.id) {
        throw new ForbiddenException(
          'No tienes permisos para consultar las métricas de un atleta asignado a otro entrenador.',
        );
      }
    }
  }

  async getStrengthProgress(athleteId: string, exerciseId: string) {
    const exercise = await this.exerciseRepo.findById(exerciseId);
    const history = await this.sessionRepo.findExerciseMaxHistory(
      athleteId,
      exerciseId,
    );

    return {
      exerciseId,
      exerciseName: exercise ? exercise.nombre : 'Ejercicio',
      grupoMuscularPrincipal: exercise ? exercise.grupoMuscularPrincipal : '',
      history: history.map((item) => ({
        date: item.date,
        maxWeightKg: item.maxWeightKg,
        estimated1RM: item.estimated1RM, // RF-08 & RF-10: 1RM estimado
      })),
    };
  }

  async getSessionHistory(athleteId: string) {
    const sessions = await this.sessionRepo.findByAthleteId(athleteId);
    return sessions.map((s) => ({
      id: s.id,
      routineName: s.routineName,
      date: s.date instanceof Date ? s.date.toISOString().split('T')[0] : String(s.date),
      completed: s.completed,
      totalVolumeKg: s.totalVolume(),
      rpe: s.rpe, // RF-13: Calificación RPE
      notes: s.notes,
      completedSetsCount: s.sets.filter((st) => st.isCompleted).length,
      totalSetsCount: s.sets.length,
      durationMinutes: s.durationMinutes || 60,
    }));
  }

  async getAdherence(athleteId: string) {
    const activePlan = await this.planRepo.findActiveByAthleteId(athleteId);
    const allSessions = await this.sessionRepo.findByAthleteId(athleteId);

    if (!activePlan) {
      return {
        athleteId,
        hasActivePlan: false,
        adherencePercentage: 0,
        completedSessions: allSessions.length,
        plannedSessions: 0,
        message: 'No posee un plan activo en este momento.',
      };
    }

    const routinesPerWeek = activePlan.routines.length || activePlan.frequencyPerWeek || 3;
    const startDate = new Date(activePlan.startDate);
    const endDate = new Date(activePlan.endDate);
    const diffDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const weeksInPlan = Math.max(1, Math.round(diffDays / 7));
    const plannedSessions = weeksInPlan * routinesPerWeek;

    const completedSessions = allSessions.filter((s) => s.completed).length;

    const percentage = plannedSessions > 0
      ? Math.min(100, Math.max(0, Math.round((completedSessions / plannedSessions) * 100)))
      : 0;

    let incentiveMessage = '¡Sigue así! Cada entrenamiento suma.';
    if (percentage >= 80) {
      incentiveMessage = '¡Excelente constancia! Estás alcanzando tus metas.';
    } else if (percentage >= 50) {
      incentiveMessage = 'Buen ritmo, mantén el compromiso esta semana.';
    }

    return {
      athleteId,
      hasActivePlan: true,
      planName: activePlan.name,
      completedSessions,
      plannedSessions,
      adherencePercentage: percentage,
      message: incentiveMessage,
    };
  }

  /**
   * Métricas Estratégicas y de Rendimiento Deportivo Institucional (Dashboard para ADMIN del CAR)
   */
  async getAdminExecutiveOverview(filters?: AdminOverviewFilters) {
    const period = filters?.period || 'all';
    const trainerFilterId = filters?.trainerId && filters.trainerId !== 'all' ? filters.trainerId : undefined;
    const adherenceFilter = filters?.adherenceRange || 'all';

    // Helper para filtro temporal
    const isWithinPeriod = (dateVal: string | Date | undefined): boolean => {
      if (!dateVal) return period === 'all';
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return true;

      // Filtro por rango de fechas explícito
      if (filters?.startDate) {
        const start = new Date(filters.startDate);
        if (!isNaN(start.getTime()) && d < start) return false;
      }
      if (filters?.endDate) {
        const end = new Date(filters.endDate);
        if (!isNaN(end.getTime()) && d > end) return false;
      }

      if (period === 'all') return true;
      const now = new Date();
      const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (period === '30d') return diffDays <= 30;
      if (period === '90d') return diffDays <= 90;
      if (period === '365d') return diffDays <= 365;
      return true;
    };

    const [
      allUsers,
      allAthletesRaw,
      allTrainersRaw,
      allPlansRaw,
      allSessionsRaw,
      allExercisesRaw,
      allWeightRecordsRaw,
      allTemplatesRaw,
    ] = await Promise.all([
      this.userRepo ? this.userRepo.findAll() : Promise.resolve([]),
      this.userRepo ? this.userRepo.findByRole(UserRole.ATLETA) : Promise.resolve([]),
      this.userRepo ? this.userRepo.findByRole(UserRole.ENTRENADOR) : Promise.resolve([]),
      this.planRepo.findAll ? this.planRepo.findAll() : Promise.resolve([]),
      this.sessionRepo.findAll ? this.sessionRepo.findAll() : Promise.resolve([]),
      this.exerciseRepo.findAll(),
      this.bodyWeightRepo?.findAll ? this.bodyWeightRepo.findAll() : Promise.resolve([]),
      this.templateRepo?.findAll ? this.templateRepo.findAll() : Promise.resolve([]),
    ]);

    // Filtrar atletas si hay filtro de entrenador
    const allAthletes = trainerFilterId
      ? allAthletesRaw.filter(
          (a) =>
            a.trainerId === trainerFilterId ||
            allPlansRaw.some(
              (p) => p.trainerId === trainerFilterId && p.athleteId === a.id,
            ),
        )
      : allAthletesRaw;

    const athleteIdSet = new Set(allAthletes.map((a) => a.id));

    // Filtrar planes si hay filtro de entrenador
    const allPlans = trainerFilterId
      ? allPlansRaw.filter((p) => p.trainerId === trainerFilterId || athleteIdSet.has(p.athleteId))
      : allPlansRaw;

    // Sesiones filtradas por atletas y período
    const allSessions = allSessionsRaw.filter((s) => {
      if (trainerFilterId && !athleteIdSet.has(s.athleteId)) return false;
      return isWithinPeriod(s.date);
    });

    const completedSessions = allSessions.filter((s) => s.completed);

    // =========================================================================
    // 1. ADHERENCIA Y COBERTURA DE PLANES
    // =========================================================================
    const now = new Date();
    const activePlans = allPlans.filter((p) => p.isActive);

    let athletesWithActivePlanCount = 0;
    let athletesWithExpiredPlanCount = 0;
    let athletesWithoutPlanCount = 0;

    const athleteDetailedList: {
      athleteId: string;
      athleteName: string;
      trainerId: string;
      trainerName: string;
      hasActivePlan: boolean;
      planStatus: 'Activo' | 'Vencido' | 'Sin Plan';
      planName: string;
      adherencePercentage: number;
      completedSessions: number;
      plannedSessions: number;
      range: 'green' | 'yellow' | 'red';
      lastSessionDate: string | null;
      tonnageKg: number;
    }[] = [];

    allAthletes.forEach((athlete) => {
      const athletePlans = allPlans.filter((p) => p.athleteId === athlete.id);
      const activePlan = athletePlans.find((p) => p.isActive);
      const mostRecentPlan = athletePlans[0];

      const athleteSessions = completedSessions.filter((s) => s.athleteId === athlete.id);

      let planStatus: 'Activo' | 'Vencido' | 'Sin Plan' = 'Sin Plan';
      let currentPlan = activePlan || mostRecentPlan;
      let plannedSessions = 0;
      let adherencePercentage = 0;

      if (activePlan) {
        planStatus = 'Activo';
        athletesWithActivePlanCount++;
      } else if (mostRecentPlan) {
        planStatus = 'Vencido';
        athletesWithExpiredPlanCount++;
      } else {
        athletesWithoutPlanCount++;
      }

      if (currentPlan) {
        const routinesPerWeek = currentPlan.routines?.length || currentPlan.frequencyPerWeek || 3;
        const startDate = new Date(currentPlan.startDate);
        const endDate = new Date(currentPlan.endDate);
        const diffDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const weeksInPlan = Math.max(1, Math.round(diffDays / 7));
        plannedSessions = Math.max(1, weeksInPlan * routinesPerWeek);
        adherencePercentage = Math.min(100, Math.max(0, Math.round((athleteSessions.length / plannedSessions) * 100)));
      }

      // Clasificación por rangos: verde (>= 80%), amarillo (50-79%), rojo (< 50%)
      let range: 'green' | 'yellow' | 'red' = 'red';
      if (adherencePercentage >= 80) {
        range = 'green';
      } else if (adherencePercentage >= 50) {
        range = 'yellow';
      }

      // Tonelaje y última sesión
      let athleteTonnage = 0;
      athleteSessions.forEach((s) => {
        (s.sets || []).forEach((st) => {
          if (st.isCompleted) {
            athleteTonnage += (st.actualWeightKg || 0) * (st.actualReps || 0);
          }
        });
      });

      const sortedSessions = [...athleteSessions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const lastSessionDate = sortedSessions[0]
        ? sortedSessions[0].date instanceof Date
          ? sortedSessions[0].date.toISOString().split('T')[0]
          : String(sortedSessions[0].date).split('T')[0]
        : null;

      const resolvedTrainerId = athlete.trainerId || currentPlan?.trainerId || '';
      const trainer = allTrainersRaw.find((t) => t.id === resolvedTrainerId);

      athleteDetailedList.push({
        athleteId: athlete.id,
        athleteName: athlete.fullName,
        trainerId: resolvedTrainerId,
        trainerName: trainer ? trainer.fullName : 'Sin asignar',
        hasActivePlan: planStatus === 'Activo',
        planStatus,
        planName: currentPlan?.name || 'Sin plan asignado',
        adherencePercentage,
        completedSessions: athleteSessions.length,
        plannedSessions,
        range,
        lastSessionDate,
        tonnageKg: Math.round(athleteTonnage),
      });
    });

    const totalAthletes = allAthletes.length;
    const activePlanCoveragePct =
      totalAthletes > 0 ? Math.round((athletesWithActivePlanCount / totalAthletes) * 100) : 0;

    const greenCount = athleteDetailedList.filter((a) => a.range === 'green').length;
    const yellowCount = athleteDetailedList.filter((a) => a.range === 'yellow').length;
    const redCount = athleteDetailedList.filter((a) => a.range === 'red').length;

    const greenPct = totalAthletes > 0 ? Math.round((greenCount / totalAthletes) * 100) : 0;
    const yellowPct = totalAthletes > 0 ? Math.round((yellowCount / totalAthletes) * 100) : 0;
    const redPct = totalAthletes > 0 ? Math.round((redCount / totalAthletes) * 100) : 0;

    const overallAdherencePct =
      athleteDetailedList.length > 0
        ? Math.round(
            athleteDetailedList.reduce((acc, curr) => acc + curr.adherencePercentage, 0) /
              athleteDetailedList.length,
          )
        : 0;

    // =========================================================================
    // 2. CARGA, FATIGA Y RENDIMIENTO DEPORTIVO
    // =========================================================================
    let totalTonnageKg = 0;
    let totalDurationMinutes = 0;
    let rpeCount1to4 = 0; // Leve
    let rpeCount5to7 = 0; // Moderado / Óptimo
    let rpeCount8to9 = 0; // Intenso
    let rpeCount10 = 0;   // Máximo / Fatiga

    const muscleGroupSetsMap = new Map<string, number>();
    const exerciseAthleteRunningMax = new Map<string, number>();
    let totalPersonalRecords = 0;
    const monthlyMap = new Map<string, { count: number; tonnageKg: number; prCount: number; sumRpe: number; rpeCount: number }>();

    // Mapeo ejercicios
    const exerciseMap = new Map<string, any>();
    allExercisesRaw.forEach((ex) => exerciseMap.set(ex.id, ex));

    const sortedChronological = [...completedSessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    sortedChronological.forEach((session) => {
      const dur = session.durationMinutes || 60;
      totalDurationMinutes += dur;

      const sessionRpe = session.rpe && session.rpe > 0 ? session.rpe : (session.completed ? 8 : undefined);
      if (sessionRpe && sessionRpe > 0) {
        if (sessionRpe <= 4) rpeCount1to4++;
        else if (sessionRpe <= 7) rpeCount5to7++;
        else if (sessionRpe <= 9) rpeCount8to9++;
        else rpeCount10++;
      }

      let sessionTonnage = 0;
      let sessionPRs = 0;

      (session.sets || []).forEach((set) => {
        if (set.isCompleted && set.actualWeightKg > 0) {
          const setTonnage = (set.actualWeightKg || 0) * (set.actualReps || 0);
          sessionTonnage += setTonnage;
          totalTonnageKg += setTonnage;

          const ex = exerciseMap.get(set.exerciseId);
          const group = ex?.grupoMuscularPrincipal || 'Otros';
          muscleGroupSetsMap.set(group, (muscleGroupSetsMap.get(group) || 0) + 1);

          // Detección de PRs
          const prKey = `${session.athleteId}_${set.exerciseId}`;
          const prevMax = exerciseAthleteRunningMax.get(prKey) || 0;
          if (set.actualWeightKg > prevMax) {
            exerciseAthleteRunningMax.set(prKey, set.actualWeightKg);
            if (prevMax > 0) {
              totalPersonalRecords++;
              sessionPRs++;
            }
          }
        }
      });

      // Agrupación mensual para evolución
      const d = new Date(session.date);
      const monthKey = !isNaN(d.getTime())
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        : 'Reciente';

      const currMonth = monthlyMap.get(monthKey) || { count: 0, tonnageKg: 0, prCount: 0, sumRpe: 0, rpeCount: 0 };
      currMonth.count++;
      currMonth.tonnageKg += sessionTonnage;
      currMonth.prCount += sessionPRs;
      if (sessionRpe && sessionRpe > 0) {
        currMonth.sumRpe += sessionRpe;
        currMonth.rpeCount++;
      }
      monthlyMap.set(monthKey, currMonth);
    });

    const sessionsWithRpeCount = rpeCount1to4 + rpeCount5to7 + rpeCount8to9 + rpeCount10;
    const averageRpe =
      sessionsWithRpeCount > 0
        ? Math.round(
            (completedSessions.reduce((sum, s) => {
              const r = s.rpe && s.rpe > 0 ? s.rpe : (s.completed ? 8 : 0);
              return sum + r;
            }, 0) /
              sessionsWithRpeCount) *
              10,
          ) / 10
        : 7.5;

    const rpeDistribution = [
      {
        level: 'Regenerativo / Leve (1-4)',
        range: '1-4',
        count: rpeCount1to4,
        percentage: sessionsWithRpeCount > 0 ? Math.round((rpeCount1to4 / sessionsWithRpeCount) * 100) : 0,
        color: 'var(--color-principal, #10b981)',
      },
      {
        level: 'Óptimo / Moderado (5-7)',
        range: '5-7',
        count: rpeCount5to7,
        percentage: sessionsWithRpeCount > 0 ? Math.round((rpeCount5to7 / sessionsWithRpeCount) * 100) : 0,
        color: 'var(--brand-beige, #eed8c0)',
      },
      {
        level: 'Alta Exigencia (8-9)',
        range: '8-9',
        count: rpeCount8to9,
        percentage: sessionsWithRpeCount > 0 ? Math.round((rpeCount8to9 / sessionsWithRpeCount) * 100) : 0,
        color: 'var(--brand-coral, #ff6b6b)',
      },
      {
        level: 'Alerta Fatiga / Extremo (10)',
        range: '10',
        count: rpeCount10,
        percentage: sessionsWithRpeCount > 0 ? Math.round((rpeCount10 / sessionsWithRpeCount) * 100) : 0,
        color: '#ef4444',
      },
    ];

    const averageDurationMinutes =
      completedSessions.length > 0 ? Math.round(totalDurationMinutes / completedSessions.length) : 60;

    // Fuerza: 1RM estimado promedio entre ejercicios principales
    let sum1RM = 0;
    let count1RM = 0;
    completedSessions.forEach((s) => {
      (s.sets || []).forEach((st) => {
        if (st.isCompleted && st.actualWeightKg > 0 && st.actualReps > 0) {
          const estimated1RM = st.actualReps <= 1
            ? st.actualWeightKg
            : Math.round(st.actualWeightKg * (1 + st.actualReps / 30) * 10) / 10;
          sum1RM += estimated1RM;
          count1RM++;
        }
      });
    });
    const averageEstimated1RM = count1RM > 0 ? Math.round((sum1RM / count1RM) * 10) / 10 : 0;

    // Evolución de Fuerza y Carga en el tiempo
    const strengthEvolution = Array.from(monthlyMap.entries())
      .map(([monthYear, data]) => ({
        monthYear,
        sessionsCount: data.count,
        tonnageKg: Math.round(data.tonnageKg),
        prsDetected: data.prCount,
        averageRpe: data.rpeCount > 0 ? Math.round((data.sumRpe / data.rpeCount) * 10) / 10 : 7.0,
      }))
      .sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    // Antropometría
    const filteredWeightRecords = allWeightRecordsRaw.filter((w) => {
      if (trainerFilterId && !athleteIdSet.has(w.athleteId)) return false;
      return isWithinPeriod(w.recordedAt);
    });

    const uniqueWeighedAthletes = new Set(filteredWeightRecords.map((w) => w.athleteId));
    const totalWeightRecords = filteredWeightRecords.length;
    const weighedAthletesCount = uniqueWeighedAthletes.size;
    const weighInFrequencyPerAthlete =
      weighedAthletesCount > 0
        ? Math.round((totalWeightRecords / weighedAthletesCount) * 10) / 10
        : 0;

    // =========================================================================
    // 3. OPERACIÓN DEL STAFF Y CATÁLOGO
    // =========================================================================
    const adminCount = allUsers.filter((u) => u.role === UserRole.ADMIN).length;
    const trainerCount = allTrainersRaw.length;
    const athleteCount = allAthletesRaw.length;

    // Carga por Entrenador
    const coachesPerformance = allTrainersRaw.map((trainer) => {
      const assignedAthletes = allAthletesRaw.filter(
        (a) =>
          a.trainerId === trainer.id ||
          allPlansRaw.some((p) => p.trainerId === trainer.id && p.athleteId === a.id),
      );
      const prescribedPlans = allPlansRaw.filter((p) => p.trainerId === trainer.id);
      const activeTrainerPlans = prescribedPlans.filter((p) => p.isActive);
      const trainerTemplates = allTemplatesRaw.filter((t) => t.trainerId === trainer.id || t.trainerId === 'SYSTEM');

      const assignedAthleteIds = new Set(assignedAthletes.map((a) => a.id));
      const trainerSessions = completedSessions.filter((s) => assignedAthleteIds.has(s.athleteId));

      const athletesAdhList = athleteDetailedList.filter(
        (a) => a.trainerId === trainer.id || assignedAthleteIds.has(a.athleteId),
      );
      const avgAdh =
        athletesAdhList.length > 0
          ? Math.round(athletesAdhList.reduce((acc, curr) => acc + curr.adherencePercentage, 0) / athletesAdhList.length)
          : 0;

      return {
        trainerId: trainer.id,
        trainerName: trainer.fullName,
        email: trainer.email,
        phone: trainer.phone || '-',
        assignedAthletesCount: assignedAthletes.length,
        prescribedPlansCount: prescribedPlans.length,
        activePlansCount: activeTrainerPlans.length,
        templatesCreatedCount: trainerTemplates.length,
        avgAdherencePct: avgAdh,
        completedSessionsCount: trainerSessions.length,
      };
    });

    // Catálogo de Ejercicios y Cobertura Multimedia
    const totalExercises = allExercisesRaw.length;
    let youtubeStandard = 0;
    let youtubeShorts = 0;
    let directMp4 = 0;
    let exercisesWithVideo = 0;

    allExercisesRaw.forEach((ex) => {
      const url = (ex.videoUrl || '').trim().toLowerCase();
      if (url.length > 5) {
        exercisesWithVideo++;
        if (url.includes('/shorts/')) {
          youtubeShorts++;
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
          youtubeStandard++;
        } else {
          directMp4++;
        }
      }
    });

    const exercisesWithoutVideo = Math.max(0, totalExercises - exercisesWithVideo);
    const videoCoveragePercentage =
      totalExercises > 0 ? Math.round((exercisesWithVideo / totalExercises) * 100) : 0;

    // Distribución Biomecánica
    const totalSetsRecorded = Array.from(muscleGroupSetsMap.values()).reduce((a, b) => a + b, 0);
    const biomechanicalDistribution = Array.from(muscleGroupSetsMap.entries())
      .map(([group, sets]) => ({
        muscleGroup: group,
        totalSets: sets,
        percentage: totalSetsRecorded > 0 ? Math.round((sets / totalSetsRecorded) * 100) : 0,
      }))
      .sort((a, b) => b.totalSets - a.totalSets);

    // Filtrar lista de atletas según adherencia si aplica
    let filteredAthletes = athleteDetailedList;
    if (adherenceFilter && adherenceFilter !== 'all') {
      filteredAthletes = athleteDetailedList.filter((a) => a.range === adherenceFilter);
    }

    return {
      filters: {
        period,
        trainerId: trainerFilterId || 'all',
        adherenceRange: adherenceFilter,
      },
      adherenceAndCoverage: {
        overallAdherencePct,
        adherenceRanges: {
          green: { count: greenCount, percentage: greenPct },
          yellow: { count: yellowCount, percentage: yellowPct },
          red: { count: redCount, percentage: redPct },
        },
        planCoverage: {
          totalAthletes,
          athletesWithActivePlan: athletesWithActivePlanCount,
          athletesWithExpiredPlan: athletesWithExpiredPlanCount,
          athletesWithoutPlan: athletesWithoutPlanCount,
          activePlanCoveragePercentage: activePlanCoveragePct,
        },
        athletesList: filteredAthletes,
      },
      loadAndSportsPerformance: {
        fatigueAndLoad: {
          averageRpe,
          rpeDistribution,
          totalDurationMinutes,
          averageDurationMinutes,
          totalTonnageKg: Math.round(totalTonnageKg),
          averageSessionTonnageKg:
            completedSessions.length > 0 ? Math.round(totalTonnageKg / completedSessions.length) : 0,
          totalCompletedSessions: completedSessions.length,
        },
        strengthAndRecords: {
          totalPRs: totalPersonalRecords,
          averageEstimated1RM,
          strengthEvolution,
        },
        anthropometry: {
          totalWeightRecords,
          weighedAthletesCount,
          weighInFrequencyPerAthlete,
        },
        biomechanicalDistribution,
      },
      staffAndCatalogOperation: {
        usersByRole: {
          adminCount,
          trainerCount,
          athleteCount,
          totalUsers: allUsers.length,
        },
        coachesPerformance,
        catalogMetrics: {
          totalExercises,
          exercisesWithVideo,
          exercisesWithoutVideo,
          videoCoveragePercentage,
          videoTypes: {
            youtubeStandard,
            youtubeShorts,
            directMp4,
          },
        },
      },
    };
  }
}
