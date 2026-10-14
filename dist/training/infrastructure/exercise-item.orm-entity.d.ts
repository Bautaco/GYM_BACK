import type { RoutineOrmEntity } from './routine.orm-entity.js';
export declare class ExerciseItemOrmEntity {
    id: string;
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    targetReps: number;
    targetWeightKg: number;
    restSeconds?: number;
    notes?: string;
    cadence?: string;
    routine: RoutineOrmEntity;
    routineId: string;
}
