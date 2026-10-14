import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('routine_templates')
export class RoutineTemplateOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  trainerId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  category?: string;

  @Column('simple-json', { nullable: true })
  exerciseItemsJson: any[];

  @CreateDateColumn()
  createdAt: Date;
}
