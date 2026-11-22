import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const dbType = config.get<string>('DATABASE_TYPE', 'better-sqlite3');

        if (dbType === 'postgres') {
          const useSsl = config.get<string>('DB_SSL') === 'true';
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST', 'localhost'),
            port: Number(config.get('DB_PORT', 5432)),
            username: config.get<string>('DB_USERNAME', 'postgres'),
            password: config.get<string>('DB_PASSWORD', 'postgres'),
            database: config.get<string>('DB_NAME', 'gym_db'),
            ssl: useSsl ? { rejectUnauthorized: false } : false,
            entities: allEntities,
            synchronize: true, // Automático en desarrollo
          };
        }

        // SQLite local por defecto con cero fricción (better-sqlite3)
        return {
          type: 'better-sqlite3',
          database: config.get<string>('DB_DATABASE', 'gym.sqlite'),
          entities: allEntities,
          synchronize: true,
        };
      },
    }),
    UsersModule,
    TrainingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
