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
      orm.frequencyPerWeek ?? 3,
      orm.sessionsPerDay ?? 1,
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
    orm.frequencyPerWeek = domain.frequencyPerWeek ?? 3;
    orm.sessionsPerDay = domain.sessionsPerDay ?? 1;

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
    const todayStr = new Date().toISOString().slice(0, 10);
    const allAthletePlans = await this.repo.find({
      where: { athleteId },
      order: { createdAt: 'DESC' },
    });

    if (allAthletePlans.length === 0) {
      return null;
    }

    // 1. Prioridad: Buscar plan cuyo rango de fechas incluya el día de hoy
    const currentPlan = allAthletePlans.find((p) => {
      const s = String(p.startDate).slice(0, 10);
      const e = String(p.endDate).slice(0, 10);
      return s <= todayStr && todayStr <= e;
    });

    if (currentPlan) {
      if (!currentPlan.isActive) {
        await this.deactivatePreviousPlans(athleteId);
        await this.repo.update(currentPlan.id, { isActive: true });
        currentPlan.isActive = true;
      }
      return this.toDomain(currentPlan);
    }

    // 2. Si no hay plan vigente hoy, buscar si hay alguno con isActive=true cuya fecha fin no haya vencido
    const activeValidPlan = allAthletePlans.find((p) => {
      const e = String(p.endDate).slice(0, 10);
      return p.isActive && e >= todayStr;
    });

    if (activeValidPlan) {
      return this.toDomain(activeValidPlan);
    }

    return null;
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

  async findAll(): Promise<TrainingPlan[]> {
    const list = await this.repo.find({
      order: { createdAt: 'DESC' },
    });
    return list.map((p) => this.toDomain(p));
  }

  async findAllActive(): Promise<TrainingPlan[]> {
    const list = await this.repo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return list.map((p) => this.toDomain(p));
  }

  async save(plan: TrainingPlan): Promise<TrainingPlan> {
    if (plan.id) {
      const routineRepo = this.repo.manager.getRepository(RoutineOrmEntity);
      const existingRoutines = await routineRepo.find({ where: { trainingPlanId: plan.id } });
      if (existingRoutines.length > 0) {
        await routineRepo.remove(existingRoutines);
      }
    }
    const orm = this.toOrm(plan);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async deactivatePreviousPlans(athleteId: string): Promise<void> {
    await this.repo.update({ athleteId, isActive: true }, { isActive: false });
  }
}
