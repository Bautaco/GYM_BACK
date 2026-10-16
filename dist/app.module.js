var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { TrainingModule } from './training/training.module.js';
import { UserOrmEntity } from './users/infrastructure/user.orm-entity.js';
import { ExerciseOrmEntity } from './training/infrastructure/exercise.orm-entity.js';
import { TrainingPlanOrmEntity } from './training/infrastructure/training-plan.orm-entity.js';
import { RoutineOrmEntity } from './training/infrastructure/routine.orm-entity.js';
import { ExerciseItemOrmEntity } from './training/infrastructure/exercise-item.orm-entity.js';
import { WorkoutSessionOrmEntity } from './training/infrastructure/workout-session.orm-entity.js';
import { LoggedSetOrmEntity } from './training/infrastructure/logged-set.orm-entity.js';
import { BodyWeightOrmEntity } from './training/infrastructure/body-weight.orm-entity.js';
import { RoutineTemplateOrmEntity } from './training/infrastructure/routine-template.orm-entity.js';
import { MuscleGroupOrmEntity } from './training/infrastructure/muscle-group.orm-entity.js';
import { TargetZoneOrmEntity } from './training/infrastructure/target-zone.orm-entity.js';
const allEntities = [
    UserOrmEntity,
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
];
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
            }),
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config) => {
                    const dbType = config.get('DATABASE_TYPE', 'sqlite');
                    if (dbType === 'postgres') {
                        return {
                            type: 'postgres',
                            host: config.get('DB_HOST', 'localhost'),
                            port: config.get('DB_PORT', 5432),
                            username: config.get('DB_USERNAME', 'postgres'),
                            password: config.get('DB_PASSWORD', 'postgres'),
                            database: config.get('DB_NAME', 'gym_db'),
                            entities: allEntities,
                            synchronize: true,
                        };
                    }
                    return {
                        type: 'sqlite',
                        database: config.get('DB_DATABASE', 'gym.sqlite'),
                        entities: allEntities,
                        synchronize: true,
                    };
                },
            }),
            UsersModule,
            TrainingModule,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map