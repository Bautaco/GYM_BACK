import type { RoutineOrmEntity } from './routine.orm-entity.js';
export declare class TrainingPlanOrmEntity {
    id: string;
    name: string;
    athleteId: string;
    trainerId: string;
    athleteName?: string;
    trainerName?: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    routines: RoutineOrmEntity[];
    createdAt: Date;
    updatedAt: Date;
}
