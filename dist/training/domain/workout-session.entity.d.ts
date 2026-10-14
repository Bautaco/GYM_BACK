import { LoggedSet } from './logged-set.entity.js';
export declare class WorkoutSession {
    readonly id: string;
    athleteId: string;
    trainingPlanId: string;
    routineId: string;
    routineName: string;
    date: Date;
    completed: boolean;
    sets: LoggedSet[];
    notes?: string | undefined;
    rpe?: number | undefined;
    createdAt?: Date | undefined;
    constructor(id: string, athleteId: string, trainingPlanId: string, routineId: string, routineName: string, date: Date, completed: boolean, sets: LoggedSet[], notes?: string | undefined, rpe?: number | undefined, createdAt?: Date | undefined);
    totalVolume(): number;
    maxWeightForExercise(exerciseId: string): number;
    max1RMForExercise(exerciseId: string): number;
}
