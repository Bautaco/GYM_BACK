import { TrainingPlanService } from '../application/training-plan.service.js';
import { CreateTrainingPlanDto } from './dtos/create-training-plan.dto.js';
export declare class TrainingPlanController {
    private readonly planService;
    constructor(planService: TrainingPlanService);
    getActivePlanByAthlete(athleteId: string): Promise<import("../domain/training-plan.entity.js").TrainingPlan | null>;
    getAllPlansByAthlete(athleteId: string): Promise<import("../domain/training-plan.entity.js").TrainingPlan[]>;
    getById(id: string): Promise<import("../domain/training-plan.entity.js").TrainingPlan>;
    createPlan(dto: CreateTrainingPlanDto, user: any): Promise<import("../domain/training-plan.entity.js").TrainingPlan>;
}
