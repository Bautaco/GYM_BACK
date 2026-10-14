import { TrainingPlan } from './training-plan.entity.js';

export interface ITrainingPlanRepository {
  findActiveByAthleteId(athleteId: string): Promise<TrainingPlan | null>;
  findAllByAthleteId(athleteId: string): Promise<TrainingPlan[]>;
  findById(id: string): Promise<TrainingPlan | null>;
  save(plan: TrainingPlan): Promise<TrainingPlan>;
  deactivatePreviousPlans(athleteId: string): Promise<void>;
}

export const TRAINING_PLAN_REPOSITORY_TOKEN = 'ITrainingPlanRepository';
