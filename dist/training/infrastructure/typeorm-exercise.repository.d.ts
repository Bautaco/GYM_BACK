import { Repository } from 'typeorm';
import { Exercise } from '../domain/exercise.entity.js';
import { IExerciseRepository } from '../domain/exercise.repository.interface.js';
import { ExerciseOrmEntity } from './exercise.orm-entity.js';
export declare class TypeOrmExerciseRepository implements IExerciseRepository {
    private readonly repo;
    constructor(repo: Repository<ExerciseOrmEntity>);
    private toDomain;
    private toOrm;
    findAll(): Promise<Exercise[]>;
    findById(id: string): Promise<Exercise | null>;
    save(exercise: Exercise): Promise<Exercise>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
