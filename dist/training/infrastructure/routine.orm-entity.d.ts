import type { TrainingPlanOrmEntity } from './training-plan.orm-entity.js';
import type { ExerciseItemOrmEntity } from './exercise-item.orm-entity.js';
export declare class RoutineOrmEntity {
    id: string;
    name: string;
    dayOfWeek: number;
    description?: string;
    trainingPlan: TrainingPlanOrmEntity;
    trainingPlanId: string;
    exerciseItems: ExerciseItemOrmEntity[];
}
