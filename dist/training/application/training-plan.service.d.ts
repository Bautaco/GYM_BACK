import { ITrainingPlanRepository } from '../domain/training-plan.repository.interface.js';
import { IUserRepository } from '../../users/domain/user.repository.interface.js';
import { TrainingPlan } from '../domain/training-plan.entity.js';
import { CreateTrainingPlanDto } from '../presentation/dtos/create-training-plan.dto.js';
export declare class TrainingPlanService {
    private readonly planRepo;
    private readonly userRepo;
    constructor(planRepo: ITrainingPlanRepository, userRepo: IUserRepository);
    createPlan(dto: CreateTrainingPlanDto, trainerId: string, trainerName?: string): Promise<TrainingPlan>;
    getActivePlanByAthlete(athleteId: string): Promise<TrainingPlan | null>;
    getAllPlansByAthlete(athleteId: string): Promise<TrainingPlan[]>;
    getPlanById(id: string): Promise<TrainingPlan>;
}
