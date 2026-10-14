import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { RoutineOrmEntity } from './routine.orm-entity.js';

@Entity('exercise_items')
export class ExerciseItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  exerciseId: string;

  @Column()
  exerciseName: string;

  @Column('int')
  targetSets: number;

  @Column('int')
  targetReps: number;

  @Column('float')
  targetWeightKg: number;

  @Column('int', { nullable: true })
  restSeconds?: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  cadence?: string; // RF-15: Cadencia / Tempo (ej. "3-0-1-0")

  @ManyToOne('RoutineOrmEntity', 'exerciseItems', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'routineId' })
  routine: RoutineOrmEntity;

  @Column()
  routineId: string;
}
