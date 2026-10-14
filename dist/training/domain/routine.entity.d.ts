import { ExerciseItem } from './exercise-item.entity.js';
export declare class Routine {
    readonly id: string;
    name: string;
    dayOfWeek: number;
    exerciseItems: ExerciseItem[];
    description?: string | undefined;
    constructor(id: string, name: string, dayOfWeek: number, exerciseItems: ExerciseItem[], description?: string | undefined);
}
