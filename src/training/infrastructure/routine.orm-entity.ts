import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import type { TrainingPlanOrmEntity } from './training-plan.orm-entity.js';
import type { ExerciseItemOrmEntity } from './exercise-item.orm-entity.js';

@Entity('routines')
export class RoutineOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('int')
  dayOfWeek: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne('TrainingPlanOrmEntity', 'routines', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trainingPlanId' })
  trainingPlan: TrainingPlanOrmEntity;

  @Column()
  trainingPlanId: string;

  @OneToMany('ExerciseItemOrmEntity', 'routine', {
    cascade: true,
    eager: true,
  })
  exerciseItems: ExerciseItemOrmEntity[];
}
