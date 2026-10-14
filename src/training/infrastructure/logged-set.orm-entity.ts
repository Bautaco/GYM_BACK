import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { WorkoutSessionOrmEntity } from './workout-session.orm-entity.js';

@Entity('logged_sets')
export class LoggedSetOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  exerciseId: string;

  @Column()
  exerciseName: string;

  @Column('int')
  setNumber: number;

  @Column('int')
  actualReps: number;

  @Column('float')
  actualWeightKg: number;

  @Column({ default: true })
  isCompleted: boolean;

  @ManyToOne('WorkoutSessionOrmEntity', 'sets', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session: WorkoutSessionOrmEntity;

  @Column()
  sessionId: string;
}
