import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { RoutineOrmEntity } from './routine.orm-entity.js';

@Entity('training_plans')
export class TrainingPlanOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  athleteId: string;

  @Column()
  trainerId: string;

  @Column({ nullable: true })
  athleteName?: string;

  @Column({ nullable: true })
  trainerName?: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('RoutineOrmEntity', 'trainingPlan', {
    cascade: true,
    eager: true,
  })
  routines: RoutineOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
