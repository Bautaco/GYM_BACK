import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingPlan } from '../domain/training-plan.entity.js';
import { Routine } from '../domain/routine.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
import { ITrainingPlanRepository } from '../domain/training-plan.repository.interface.js';
import { TrainingPlanOrmEntity } from './training-plan.orm-entity.js';
import { RoutineOrmEntity } from './routine.orm-entity.js';
import { ExerciseItemOrmEntity } from './exercise-item.orm-entity.js';

@Injectable()
export class TypeOrmTrainingPlanRepository implements ITrainingPlanRepository {
  constructor(
    @InjectRepository(TrainingPlanOrmEntity)
    private readonly repo: Repository<TrainingPlanOrmEntity>,
  ) {}

  private toDomain(orm: TrainingPlanOrmEntity): TrainingPlan {
    const routines = (orm.routines || []).map((r) => {
      const items = (r.exerciseItems || []).map(
        (i) =>
          new ExerciseItem(
            i.id,
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
      return new Routine(r.id, r.name, r.dayOfWeek, items, r.description);
    });

    return new TrainingPlan(
      orm.id,
      orm.name,
      orm.athleteId,
      orm.trainerId,
      new Date(orm.startDate),
      new Date(orm.endDate),
      orm.isActive,
      routines,
      orm.athleteName,
      orm.trainerName,
      orm.createdAt,
    );
  }

  private toOrm(domain: TrainingPlan): TrainingPlanOrmEntity {
    const orm = new TrainingPlanOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.name = domain.name;
    orm.athleteId = domain.athleteId;
    orm.trainerId = domain.trainerId;
    orm.athleteName = domain.athleteName;
    orm.trainerName = domain.trainerName;
    orm.startDate = domain.startDate instanceof Date 
      ? domain.startDate.toISOString().split('T')[0] 
      : String(domain.startDate);
    orm.endDate = domain.endDate instanceof Date 
      ? domain.endDate.toISOString().split('T')[0] 
      : String(domain.endDate);
    orm.isActive = domain.isActive;

    orm.routines = (domain.routines || []).map((r) => {
      const routineOrm = new RoutineOrmEntity();
      if (r.id) routineOrm.id = r.id;
      routineOrm.name = r.name;
      routineOrm.dayOfWeek = r.dayOfWeek;
      routineOrm.description = r.description;
      routineOrm.exerciseItems = (r.exerciseItems || []).map((i) => {
        const itemOrm = new ExerciseItemOrmEntity();
        if (i.id) itemOrm.id = i.id;
        itemOrm.exerciseId = i.exerciseId;
        itemOrm.exerciseName = i.exerciseName;
        itemOrm.targetSets = i.targetSets;
        itemOrm.targetReps = i.targetReps;
        itemOrm.targetWeightKg = i.targetWeightKg;
        itemOrm.restSeconds = i.restSeconds;
        itemOrm.notes = i.notes;
        itemOrm.cadence = i.cadence;
        return itemOrm;
      });
      return routineOrm;
    });

    return orm;
  }

  async findActiveByAthleteId(athleteId: string): Promise<TrainingPlan | null> {
    const found = await this.repo.findOne({
      where: { athleteId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    return found ? this.toDomain(found) : null;
  }

  async findAllByAthleteId(athleteId: string): Promise<TrainingPlan[]> {
    const list = await this.repo.find({
      where: { athleteId },
      order: { createdAt: 'DESC' },
    });
    return list.map((p) => this.toDomain(p));
  }

  async findById(id: string): Promise<TrainingPlan | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async save(plan: TrainingPlan): Promise<TrainingPlan> {
    const orm = this.toOrm(plan);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async deactivatePreviousPlans(athleteId: string): Promise<void> {
    await this.repo.update({ athleteId, isActive: true }, { isActive: false });
  }
}
