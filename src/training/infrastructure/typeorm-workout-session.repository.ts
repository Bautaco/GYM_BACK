import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutSession } from '../domain/workout-session.entity.js';
import { LoggedSet } from '../domain/logged-set.entity.js';
import { IWorkoutSessionRepository } from '../domain/workout-session.repository.interface.js';
import { WorkoutSessionOrmEntity } from './workout-session.orm-entity.js';
import { LoggedSetOrmEntity } from './logged-set.orm-entity.js';

@Injectable()
export class TypeOrmWorkoutSessionRepository
  implements IWorkoutSessionRepository
{
  constructor(
    @InjectRepository(WorkoutSessionOrmEntity)
    private readonly sessionRepo: Repository<WorkoutSessionOrmEntity>,
    @InjectRepository(LoggedSetOrmEntity)
    private readonly setRepo: Repository<LoggedSetOrmEntity>,
  ) {}

  private toDomain(orm: WorkoutSessionOrmEntity): WorkoutSession {
    const sets = (orm.sets || []).map(
      (s) =>
        new LoggedSet(
          s.id,
          s.exerciseId,
          s.exerciseName,
          s.setNumber,
          s.actualReps,
          s.actualWeightKg,
          s.isCompleted,
        ),
    );

    return new WorkoutSession(
      orm.id,
      orm.athleteId,
      orm.trainingPlanId,
      orm.routineId,
      orm.routineName,
      new Date(orm.date),
      orm.completed,
      sets,
      orm.notes,
      orm.rpe,
      orm.createdAt,
    );
  }

  private toOrm(domain: WorkoutSession): WorkoutSessionOrmEntity {
    const orm = new WorkoutSessionOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.athleteId = domain.athleteId;
    orm.trainingPlanId = domain.trainingPlanId;
    orm.routineId = domain.routineId;
    orm.routineName = domain.routineName;
    orm.date = domain.date instanceof Date
      ? domain.date.toISOString().split('T')[0]
      : String(domain.date);
    orm.completed = domain.completed;
    orm.notes = domain.notes;
    orm.rpe = domain.rpe;

    orm.sets = (domain.sets || []).map((s) => {
      const setOrm = new LoggedSetOrmEntity();
      if (s.id) setOrm.id = s.id;
      setOrm.exerciseId = s.exerciseId;
      setOrm.exerciseName = s.exerciseName;
      setOrm.setNumber = s.setNumber;
      setOrm.actualReps = s.actualReps;
      setOrm.actualWeightKg = s.actualWeightKg;
      setOrm.isCompleted = s.isCompleted;
      return setOrm;
    });

    return orm;
  }

  async save(session: WorkoutSession): Promise<WorkoutSession> {
    const orm = this.toOrm(session);
    const saved = await this.sessionRepo.save(orm);
    return this.toDomain(saved);
  }

  async findByAthleteId(athleteId: string): Promise<WorkoutSession[]> {
    const list = await this.sessionRepo.find({
      where: { athleteId },
      order: { date: 'DESC' },
    });
    return list.map((s) => this.toDomain(s));
  }

  async findByAthleteAndDate(
    athleteId: string,
    date: Date,
  ): Promise<WorkoutSession | null> {
    const dateStr = date.toISOString().split('T')[0];
    const found = await this.sessionRepo.findOne({
      where: { athleteId, date: dateStr },
    });
    return found ? this.toDomain(found) : null;
  }

  async countCompletedByAthleteInDateRange(
    athleteId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const qb = this.sessionRepo.createQueryBuilder('s');
    qb.where('s.athleteId = :athleteId', { athleteId })
      .andWhere('s.completed = :completed', { completed: true })
      .andWhere('s.date >= :startStr', { startStr })
      .andWhere('s.date <= :endStr', { endStr });

    return qb.getCount();
  }

  async findExerciseMaxHistory(
    athleteId: string,
    exerciseId: string,
  ): Promise<{ date: string; maxWeightKg: number; estimated1RM: number }[]> {
    const sessions = await this.sessionRepo.find({
      where: { athleteId },
      order: { date: 'ASC' },
    });

    const result: { date: string; maxWeightKg: number; estimated1RM: number }[] = [];
    for (const session of sessions) {
      const matchSets = (session.sets || []).filter(
        (s) => s.exerciseId === exerciseId && s.isCompleted,
      );
      if (matchSets.length > 0) {
        const maxWeight = Math.max(...matchSets.map((s) => s.actualWeightKg));
        const estimated1RMs = matchSets.map((s) => {
          if (s.actualReps <= 1) return s.actualWeightKg;
          return Math.round(s.actualWeightKg * (1 + s.actualReps / 30) * 10) / 10;
        });
        const max1RM = Math.max(...estimated1RMs);

        result.push({
          date: session.date,
          maxWeightKg: maxWeight,
          estimated1RM: max1RM,
        });
      }
    }
    return result;
  }
}
