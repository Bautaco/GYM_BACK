import { ExerciseItem } from './exercise-item.entity.js';
export declare class RoutineTemplate {
    readonly id: string;
    trainerId: string;
    name: string;
    description?: string | undefined;
    category?: string | undefined;
    exerciseItems: ExerciseItem[];
    createdAt?: Date | undefined;
    constructor(id: string, trainerId: string, name: string, description?: string | undefined, category?: string | undefined, exerciseItems?: ExerciseItem[], createdAt?: Date | undefined);
}
