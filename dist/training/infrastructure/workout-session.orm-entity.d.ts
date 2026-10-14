import type { LoggedSetOrmEntity } from './logged-set.orm-entity.js';
export declare class WorkoutSessionOrmEntity {
    id: string;
    athleteId: string;
    trainingPlanId: string;
    routineId: string;
    routineName: string;
    date: string;
    completed: boolean;
    notes?: string;
    rpe?: number;
    sets: LoggedSetOrmEntity[];
    createdAt: Date;
}
