import { OnApplicationBootstrap } from '@nestjs/common';
import { IUserRepository } from '../../users/domain/user.repository.interface.js';
import { IExerciseRepository } from '../domain/exercise.repository.interface.js';
import { ITrainingPlanRepository } from '../domain/training-plan.repository.interface.js';
import { IBodyWeightRepository } from '../domain/body-weight.repository.interface.js';
import { IWorkoutSessionRepository } from '../domain/workout-session.repository.interface.js';
import { IRoutineTemplateRepository } from '../domain/routine-template.repository.interface.js';
export declare class DatabaseSeederService implements OnApplicationBootstrap {
    private readonly userRepo;
    private readonly exerciseRepo;
    private readonly planRepo;
    private readonly bodyWeightRepo;
    private readonly sessionRepo;
    private readonly templateRepo;
    private readonly logger;
    constructor(userRepo: IUserRepository, exerciseRepo: IExerciseRepository, planRepo: ITrainingPlanRepository, bodyWeightRepo: IBodyWeightRepository, sessionRepo: IWorkoutSessionRepository, templateRepo: IRoutineTemplateRepository);
    onApplicationBootstrap(): Promise<void>;
    private seedUsers;
    private seedExercises;
    private seedSamplePlanAndMetrics;
    private seedTemplates;
}
