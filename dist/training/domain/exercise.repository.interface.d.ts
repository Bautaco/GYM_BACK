import { Exercise } from './exercise.entity.js';
export interface IExerciseRepository {
    findAll(): Promise<Exercise[]>;
    findById(id: string): Promise<Exercise | null>;
    save(exercise: Exercise): Promise<Exercise>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
export declare const EXERCISE_REPOSITORY_TOKEN = "IExerciseRepository";
