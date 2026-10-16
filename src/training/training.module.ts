import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module.js';

// ORM Entities
import { ExerciseOrmEntity } from './infrastructure/exercise.orm-entity.js';
import { TrainingPlanOrmEntity } from './infrastructure/training-plan.orm-entity.js';
import { RoutineOrmEntity } from './infrastructure/routine.orm-entity.js';
import { ExerciseItemOrmEntity } from './infrastructure/exercise-item.orm-entity.js';
import { WorkoutSessionOrmEntity } from './infrastructure/workout-session.orm-entity.js';
import { LoggedSetOrmEntity } from './infrastructure/logged-set.orm-entity.js';
import { BodyWeightOrmEntity } from './infrastructure/body-weight.orm-entity.js';
import { RoutineTemplateOrmEntity } from './infrastructure/routine-template.orm-entity.js';
import { MuscleGroupOrmEntity } from './infrastructure/muscle-group.orm-entity.js';
import { TargetZoneOrmEntity } from './infrastructure/target-zone.orm-entity.js';

// Repositories Tokens & Concrete Implementations
import { EXERCISE_REPOSITORY_TOKEN } from './domain/exercise.repository.interface.js';
import { TypeOrmExerciseRepository } from './infrastructure/typeorm-exercise.repository.js';
import { TRAINING_PLAN_REPOSITORY_TOKEN } from './domain/training-plan.repository.interface.js';
import { TypeOrmTrainingPlanRepository } from './infrastructure/typeorm-training-plan.repository.js';
import { WORKOUT_SESSION_REPOSITORY_TOKEN } from './domain/workout-session.repository.interface.js';
import { TypeOrmWorkoutSessionRepository } from './infrastructure/typeorm-workout-session.repository.js';
import { BODY_WEIGHT_REPOSITORY_TOKEN } from './domain/body-weight.repository.interface.js';
import { TypeOrmBodyWeightRepository } from './infrastructure/typeorm-body-weight.repository.js';
import { ROUTINE_TEMPLATE_REPOSITORY_TOKEN } from './domain/routine-template.repository.interface.js';
import { TypeOrmRoutineTemplateRepository } from './infrastructure/typeorm-routine-template.repository.js';

// Application Services
import { ExerciseService } from './application/exercise.service.js';
import { TrainingPlanService } from './application/training-plan.service.js';
import { WorkoutSessionService } from './application/workout-session.service.js';
import { BodyWeightService } from './application/body-weight.service.js';
import { AnalyticsService } from './application/analytics.service.js';
import { RoutineTemplateService } from './application/routine-template.service.js';
import { DatabaseSeederService } from './infrastructure/database-seeder.service.js';

// Controllers
import { ExerciseController } from './presentation/exercise.controller.js';
import { TrainingPlanController } from './presentation/training-plan.controller.js';
import { WorkoutSessionController } from './presentation/workout-session.controller.js';
import { BodyWeightController } from './presentation/body-weight.controller.js';
import { AnalyticsController } from './presentation/analytics.controller.js';
import { RoutineTemplateController } from './presentation/routine-template.controller.js';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      ExerciseOrmEntity,
      TrainingPlanOrmEntity,
      RoutineOrmEntity,
      ExerciseItemOrmEntity,
      WorkoutSessionOrmEntity,
      LoggedSetOrmEntity,
      BodyWeightOrmEntity,
      RoutineTemplateOrmEntity,
      MuscleGroupOrmEntity,
      TargetZoneOrmEntity,
    ]),
  ],
  controllers: [
    ExerciseController,
    TrainingPlanController,
    WorkoutSessionController,
    BodyWeightController,
    AnalyticsController,
    RoutineTemplateController,
  ],
  providers: [
    {
      provide: EXERCISE_REPOSITORY_TOKEN,
      useClass: TypeOrmExerciseRepository,
    },
    {
      provide: TRAINING_PLAN_REPOSITORY_TOKEN,
      useClass: TypeOrmTrainingPlanRepository,
    },
    {
      provide: WORKOUT_SESSION_REPOSITORY_TOKEN,
      useClass: TypeOrmWorkoutSessionRepository,
    },
    {
      provide: BODY_WEIGHT_REPOSITORY_TOKEN,
      useClass: TypeOrmBodyWeightRepository,
    },
    {
      provide: ROUTINE_TEMPLATE_REPOSITORY_TOKEN,
      useClass: TypeOrmRoutineTemplateRepository,
    },
    ExerciseService,
    TrainingPlanService,
    WorkoutSessionService,
    BodyWeightService,
    AnalyticsService,
    RoutineTemplateService,
    DatabaseSeederService,
  ],
  exports: [
    ExerciseService,
    TrainingPlanService,
    WorkoutSessionService,
    BodyWeightService,
    AnalyticsService,
    RoutineTemplateService,
  ],
})
export class TrainingModule {}
