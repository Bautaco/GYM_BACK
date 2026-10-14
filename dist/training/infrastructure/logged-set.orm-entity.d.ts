import type { WorkoutSessionOrmEntity } from './workout-session.orm-entity.js';
export declare class LoggedSetOrmEntity {
    id: string;
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    actualReps: number;
    actualWeightKg: number;
    isCompleted: boolean;
    session: WorkoutSessionOrmEntity;
    sessionId: string;
}
