export declare class ExerciseItem {
    readonly id: string;
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    targetReps: number;
    targetWeightKg: number;
    restSeconds?: number | undefined;
    notes?: string | undefined;
    cadence?: string | undefined;
    constructor(id: string, exerciseId: string, exerciseName: string, targetSets: number, targetReps: number, targetWeightKg: number, restSeconds?: number | undefined, notes?: string | undefined, cadence?: string | undefined);
}
