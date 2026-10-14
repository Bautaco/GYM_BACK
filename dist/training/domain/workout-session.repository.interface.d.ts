import { WorkoutSession } from './workout-session.entity.js';
export interface IWorkoutSessionRepository {
    save(session: WorkoutSession): Promise<WorkoutSession>;
    findByAthleteId(athleteId: string): Promise<WorkoutSession[]>;
    findByAthleteAndDate(athleteId: string, date: Date): Promise<WorkoutSession | null>;
    countCompletedByAthleteInDateRange(athleteId: string, startDate: Date, endDate: Date): Promise<number>;
    findExerciseMaxHistory(athleteId: string, exerciseId: string): Promise<{
        date: string;
        maxWeightKg: number;
        estimated1RM: number;
    }[]>;
}
export declare const WORKOUT_SESSION_REPOSITORY_TOKEN = "IWorkoutSessionRepository";
