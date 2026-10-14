import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutineTemplate } from '../domain/routine-template.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
import { IRoutineTemplateRepository } from '../domain/routine-template.repository.interface.js';
import { RoutineTemplateOrmEntity } from './routine-template.orm-entity.js';

@Injectable()
export class TypeOrmRoutineTemplateRepository implements IRoutineTemplateRepository {
  constructor(
    @InjectRepository(RoutineTemplateOrmEntity)
    private readonly repo: Repository<RoutineTemplateOrmEntity>,
  ) {}

  private toDomain(orm: RoutineTemplateOrmEntity): RoutineTemplate {
    const items = (orm.exerciseItemsJson || []).map(
      (i: any) =>
        new ExerciseItem(
          i.id || '',
          i.exerciseId,
          i.exerciseName,
          i.targetSets,
          i.targetReps,
          i.targetWeightKg,
          i.restSeconds,
          i.notes,
          i.cadence,
        ),
    );

    return new RoutineTemplate(
      orm.id,
      orm.trainerId,
      orm.name,
      orm.description,
      orm.category,
      items,
      orm.createdAt,
    );
  }

  private toOrm(domain: RoutineTemplate): RoutineTemplateOrmEntity {
    const orm = new RoutineTemplateOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.trainerId = domain.trainerId;
    orm.name = domain.name;
    orm.description = domain.description;
    orm.category = domain.category;
    orm.exerciseItemsJson = (domain.exerciseItems || []).map((i) => ({
      id: i.id,
      exerciseId: i.exerciseId,
      exerciseName: i.exerciseName,
      targetSets: i.targetSets,
      targetReps: i.targetReps,
      targetWeightKg: i.targetWeightKg,
      restSeconds: i.restSeconds,
      notes: i.notes,
      cadence: i.cadence,
    }));
    return orm;
  }

  async save(template: RoutineTemplate): Promise<RoutineTemplate> {
    const orm = this.toOrm(template);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<RoutineTemplate | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findAll(trainerId?: string): Promise<RoutineTemplate[]> {
    let list: RoutineTemplateOrmEntity[];
    if (trainerId) {
      // Find trainer's templates OR system templates (trainerId = 'SYSTEM')
      list = await this.repo.find({
        where: [{ trainerId }, { trainerId: 'SYSTEM' }],
        order: { name: 'ASC' },
      });
    } else {
      list = await this.repo.find({ order: { name: 'ASC' } });
    }
    return list.map((orm) => this.toDomain(orm));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }
}
