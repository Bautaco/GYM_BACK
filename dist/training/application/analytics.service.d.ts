import { IWorkoutSessionRepository } from '../domain/workout-session.repository.interface.js';
import { ITrainingPlanRepository } from '../domain/training-plan.repository.interface.js';
import { IExerciseRepository } from '../domain/exercise.repository.interface.js';
export declare class AnalyticsService {
    private readonly sessionRepo;
    private readonly planRepo;
    private readonly exerciseRepo;
    constructor(sessionRepo: IWorkoutSessionRepository, planRepo: ITrainingPlanRepository, exerciseRepo: IExerciseRepository);
    getStrengthProgress(athleteId: string, exerciseId: string): Promise<{
        exerciseId: string;
        exerciseName: string;
        grupoMuscularPrincipal: string;
        history: {
            date: string;
            maxWeightKg: number;
            estimated1RM: number;
        }[];
    }>;
    getSessionHistory(athleteId: string): Promise<{
        id: string;
        routineName: string;
        date: string;
        completed: boolean;
        totalVolumeKg: number;
        rpe: number | undefined;
        notes: string | undefined;
        completedSetsCount: number;
        totalSetsCount: number;
    }[]>;
    getAdherence(athleteId: string): Promise<{
        athleteId: string;
        hasActivePlan: boolean;
        adherencePercentage: number;
        completedSessions: number;
        plannedSessions: number;
        message: string;
        planName?: undefined;
    } | {
        athleteId: string;
        hasActivePlan: boolean;
        planName: string;
        completedSessions: number;
        plannedSessions: number;
        adherencePercentage: number;
        message: string;
    }>;
}
