import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('exercises')
export class ExerciseOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  grupoMuscularPrincipal: string;

  @Column('simple-json')
  zonasTrabajadas: string[];

  @Column('text')
  descripcion: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
