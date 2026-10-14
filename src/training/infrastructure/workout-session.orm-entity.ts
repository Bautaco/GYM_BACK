import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import type { LoggedSetOrmEntity } from './logged-set.orm-entity.js';

@Entity('workout_sessions')
export class WorkoutSessionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  athleteId: string;

  @Column()
  trainingPlanId: string;

  @Column()
  routineId: string;

  @Column()
  routineName: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: true })
  completed: boolean;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'int', nullable: true })
  rpe?: number; // RF-13: Calificación de esfuerzo post-sesión (1-10)

  @OneToMany('LoggedSetOrmEntity', 'session', {
    cascade: true,
    eager: true,
  })
  sets: LoggedSetOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
