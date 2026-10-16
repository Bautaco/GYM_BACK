import { OnApplicationBootstrap } from '@nestjs/common';
import { IUserRepository } from '../../users/domain/user.repository.interface.js';
import { IExerciseRepository } from '../domain/exercise.repository.interface.js';
import { ITrainingPlanRepository } from '../domain/training-plan.repository.interface.js';
import { IBodyWeightRepository } from '../domain/body-weight.repository.interface.js';
import { IWorkoutSessionRepository } from '../domain/workout-session.repository.interface.js';
import { IRoutineTemplateRepository } from '../domain/routine-template.repository.interface.js';
import { Repository } from 'typeorm';
import { MuscleGroupOrmEntity } from './muscle-group.orm-entity.js';
import { TargetZoneOrmEntity } from './target-zone.orm-entity.js';
export declare class DatabaseSeederService implements OnApplicationBootstrap {
    private readonly userRepo;
    private readonly exerciseRepo;
    private readonly planRepo;
    private readonly bodyWeightRepo;
    private readonly sessionRepo;
    private readonly templateRepo;
    private readonly muscleGroupRepo;
    private readonly targetZoneRepo;
    private readonly logger;
    constructor(userRepo: IUserRepository, exerciseRepo: IExerciseRepository, planRepo: ITrainingPlanRepository, bodyWeightRepo: IBodyWeightRepository, sessionRepo: IWorkoutSessionRepository, templateRepo: IRoutineTemplateRepository, muscleGroupRepo: Repository<MuscleGroupOrmEntity>, targetZoneRepo: Repository<TargetZoneOrmEntity>);
    onApplicationBootstrap(): Promise<void>;
    private seedMuscleMetadata;
    private seedUsers;
    private seedExercises;
    private seedSamplePlanAndMetrics;
    private seedTemplates;
}
