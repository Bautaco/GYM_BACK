export declare class LoggedSetDto {
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    actualReps: number;
    actualWeightKg: number;
    isCompleted?: boolean;
}
export declare class LogWorkoutSessionDto {
    athleteId: string;
    trainingPlanId: string;
    routineId: string;
    routineName: string;
    date: string;
    completed?: boolean;
    notes?: string;
    rpe?: number;
    sets: LoggedSetDto[];
}
