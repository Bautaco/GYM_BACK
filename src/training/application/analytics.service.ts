import { Injectable, Inject } from '@nestjs/common';
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

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(WORKOUT_SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepo: IWorkoutSessionRepository,
    @Inject(TRAINING_PLAN_REPOSITORY_TOKEN)
    private readonly planRepo: ITrainingPlanRepository,
    @Inject(EXERCISE_REPOSITORY_TOKEN)
    private readonly exerciseRepo: IExerciseRepository,
  ) {}

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

    // Number of routines in the weekly plan
    const routinesPerWeek = activePlan.routines.length || 3;
    // Estimated planned sessions over the 4-week default plan cycle (or actual date span)
    const startDate = new Date(activePlan.startDate);
    const endDate = new Date(activePlan.endDate);
    const diffDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const weeksInPlan = Math.max(1, Math.round(diffDays / 7));
    const plannedSessions = weeksInPlan * routinesPerWeek;

    // Completed sessions within the active plan window
    const completedSessions = allSessions.filter((s) => s.completed).length;

    const percentage = plannedSessions > 0
      ? Math.min(100, Math.round((completedSessions / plannedSessions) * 100))
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
}
