import { Repository } from 'typeorm';
import { TrainingPlan } from '../domain/training-plan.entity.js';
import { ITrainingPlanRepository } from '../domain/training-plan.repository.interface.js';
import { TrainingPlanOrmEntity } from './training-plan.orm-entity.js';
export declare class TypeOrmTrainingPlanRepository implements ITrainingPlanRepository {
    private readonly repo;
    constructor(repo: Repository<TrainingPlanOrmEntity>);
    private toDomain;
    private toOrm;
    findActiveByAthleteId(athleteId: string): Promise<TrainingPlan | null>;
    findAllByAthleteId(athleteId: string): Promise<TrainingPlan[]>;
    findById(id: string): Promise<TrainingPlan | null>;
    save(plan: TrainingPlan): Promise<TrainingPlan>;
    deactivatePreviousPlans(athleteId: string): Promise<void>;
}
