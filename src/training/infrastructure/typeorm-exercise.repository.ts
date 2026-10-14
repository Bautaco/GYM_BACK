import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../domain/exercise.entity.js';
import { IExerciseRepository } from '../domain/exercise.repository.interface.js';
import { ExerciseOrmEntity } from './exercise.orm-entity.js';

@Injectable()
export class TypeOrmExerciseRepository implements IExerciseRepository {
  constructor(
    @InjectRepository(ExerciseOrmEntity)
    private readonly repo: Repository<ExerciseOrmEntity>,
  ) {}

  private toDomain(orm: ExerciseOrmEntity): Exercise {
    return new Exercise(
      orm.id,
      orm.nombre,
      orm.grupoMuscularPrincipal,
      orm.zonasTrabajadas || [],
      orm.descripcion,
      orm.videoUrl,
      orm.createdAt,
    );
  }

  private toOrm(domain: Exercise): ExerciseOrmEntity {
    const orm = new ExerciseOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.nombre = domain.nombre;
    orm.grupoMuscularPrincipal = domain.grupoMuscularPrincipal;
    orm.zonasTrabajadas = domain.zonasTrabajadas;
    orm.descripcion = domain.descripcion;
    orm.videoUrl = domain.videoUrl;
    return orm;
  }

  async findAll(): Promise<Exercise[]> {
    const list = await this.repo.find({ order: { nombre: 'ASC' } });
    return list.map((e) => this.toDomain(e));
  }

  async findById(id: string): Promise<Exercise | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async save(exercise: Exercise): Promise<Exercise> {
    const orm = this.toOrm(exercise);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }
}
