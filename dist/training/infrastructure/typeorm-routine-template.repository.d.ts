import { Repository } from 'typeorm';
import { RoutineTemplate } from '../domain/routine-template.entity.js';
import { IRoutineTemplateRepository } from '../domain/routine-template.repository.interface.js';
import { RoutineTemplateOrmEntity } from './routine-template.orm-entity.js';
export declare class TypeOrmRoutineTemplateRepository implements IRoutineTemplateRepository {
    private readonly repo;
    constructor(repo: Repository<RoutineTemplateOrmEntity>);
    private toDomain;
    private toOrm;
    save(template: RoutineTemplate): Promise<RoutineTemplate>;
    findById(id: string): Promise<RoutineTemplate | null>;
    findAll(trainerId?: string): Promise<RoutineTemplate[]>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
