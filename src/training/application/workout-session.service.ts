import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  IWorkoutSessionRepository,
  WORKOUT_SESSION_REPOSITORY_TOKEN,
} from '../domain/workout-session.repository.interface.js';
import { WorkoutSession } from '../domain/workout-session.entity.js';
import { LoggedSet } from '../domain/logged-set.entity.js';
import { LogWorkoutSessionDto } from '../presentation/dtos/log-workout-session.dto.js';

export interface DetectedPR {
  exerciseId: string;
  exerciseName: string;
  type: 'PESO_MAXIMO' | '1RM_ESTIMADO';
  previousRecord: number;
  newRecord: number;
  improvement: number;
}

export interface LogWorkoutSessionResult {
  session: WorkoutSession;
  personalRecords: DetectedPR[];
}

@Injectable()
export class WorkoutSessionService {
  constructor(
    @Inject(WORKOUT_SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepo: IWorkoutSessionRepository,
  ) {}

  async logSession(dto: LogWorkoutSessionDto): Promise<LogWorkoutSessionResult> {
    const loggedSets = (dto.sets || []).map((s) => {
      if (s.actualWeightKg < 0) {
        throw new BadRequestException('El peso utilizado no puede ser un valor negativo');
      }
      if (s.actualReps < 0) {
        throw new BadRequestException('Las repeticiones no pueden ser un valor negativo');
      }
      return new LoggedSet(
        '',
        s.exerciseId,
        s.exerciseName,
        s.setNumber,
        Number(s.actualReps),
        Number(s.actualWeightKg),
        s.isCompleted ?? true,
      );
    });

    const session = new WorkoutSession(
      '',
      dto.athleteId,
      dto.trainingPlanId,
      dto.routineId,
      dto.routineName,
      new Date(dto.date),
      dto.completed ?? true,
      loggedSets,
      dto.notes,
      dto.rpe, // RF-13: Calificación RPE de esfuerzo
      new Date(),
    );

    // RF-11: Detección automática de Personal Records (PRs)
    const previousSessions = (await this.sessionRepo.findByAthleteId(dto.athleteId)) || [];
    const detectedPRs: DetectedPR[] = [];

    // Agrupar ejercicios completados en la sesión actual
    const exerciseIds = Array.from(new Set(loggedSets.filter((s) => s.isCompleted).map((s) => s.exerciseId)));

    for (const exId of exerciseIds) {
      const exName = loggedSets.find((s) => s.exerciseId === exId)?.exerciseName || 'Ejercicio';

      // Histórico previo de peso máximo
      const prevWeights = previousSessions.map((ps) => ps.maxWeightForExercise(exId)).filter((w) => w > 0);
      const prevMaxWeight = prevWeights.length > 0 ? Math.max(...prevWeights) : 0;

      // Peso máximo de la sesión actual
      const currentMaxWeight = session.maxWeightForExercise(exId);

      if (currentMaxWeight > prevMaxWeight && prevMaxWeight > 0) {
        detectedPRs.push({
          exerciseId: exId,
          exerciseName: exName,
          type: 'PESO_MAXIMO',
          previousRecord: prevMaxWeight,
          newRecord: currentMaxWeight,
          improvement: Math.round((currentMaxWeight - prevMaxWeight) * 10) / 10,
        });
      }

      // Histórico previo de 1RM estimado
      const prev1RMs = previousSessions.map((ps) => ps.max1RMForExercise(exId)).filter((r) => r > 0);
      const prevMax1RM = prev1RMs.length > 0 ? Math.max(...prev1RMs) : 0;

      // 1RM de la sesión actual
      const current1RM = session.max1RMForExercise(exId);

      if (current1RM > prevMax1RM && prevMax1RM > 0) {
        detectedPRs.push({
          exerciseId: exId,
          exerciseName: exName,
          type: '1RM_ESTIMADO',
          previousRecord: prevMax1RM,
          newRecord: current1RM,
          improvement: Math.round((current1RM - prevMax1RM) * 10) / 10,
        });
      }
    }

    const savedSession = await this.sessionRepo.save(session);
    return {
      session: savedSession,
      personalRecords: detectedPRs,
    };
  }

  async getSessionsByAthlete(athleteId: string): Promise<WorkoutSession[]> {
    return this.sessionRepo.findByAthleteId(athleteId);
  }
}
