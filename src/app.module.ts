import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const dbType = config.get<string>('DATABASE_TYPE', 'sqlite');

        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST', 'localhost'),
            port: config.get<number>('DB_PORT', 5432),
            username: config.get<string>('DB_USERNAME', 'postgres'),
            password: config.get<string>('DB_PASSWORD', 'postgres'),
            database: config.get<string>('DB_NAME', 'gym_db'),
            entities: allEntities,
            synchronize: true, // Automático en desarrollo
          };
        }

        // SQLite local por defecto con cero fricción
        return {
          type: 'sqlite',
          database: config.get<string>('DB_DATABASE', 'gym.sqlite'),
          entities: allEntities,
          synchronize: true,
        } as any;
      },
    }),
    UsersModule,
    TrainingModule,
  ],
})
export class AppModule {}
