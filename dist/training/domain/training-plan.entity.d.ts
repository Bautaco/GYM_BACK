import { Routine } from './routine.entity.js';
export declare class TrainingPlan {
    readonly id: string;
    name: string;
    athleteId: string;
    trainerId: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    routines: Routine[];
    athleteName?: string | undefined;
    trainerName?: string | undefined;
    createdAt?: Date | undefined;
    constructor(id: string, name: string, athleteId: string, trainerId: string, startDate: Date, endDate: Date, isActive: boolean, routines: Routine[], athleteName?: string | undefined, trainerName?: string | undefined, createdAt?: Date | undefined);
    deactivate(): void;
    isCurrent(): boolean;
}
