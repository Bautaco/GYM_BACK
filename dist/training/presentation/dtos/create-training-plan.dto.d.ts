export declare class ExerciseItemDto {
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    targetReps: number;
    targetWeightKg: number;
    restSeconds?: number;
    notes?: string;
    cadence?: string;
}
export declare class RoutineDto {
    name: string;
    dayOfWeek: number;
    description?: string;
    exerciseItems: ExerciseItemDto[];
}
export declare class CreateTrainingPlanDto {
    name: string;
    athleteId: string;
    startDate: string;
    endDate: string;
    routines: RoutineDto[];
}
