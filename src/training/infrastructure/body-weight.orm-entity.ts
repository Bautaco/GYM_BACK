import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('body_weight_records')
export class BodyWeightOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  athleteId: string;

  @Column('float')
  weightKg: number;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  recordedAt: Date;
}
