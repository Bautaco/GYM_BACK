var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutSession } from '../domain/workout-session.entity.js';
import { LoggedSet } from '../domain/logged-set.entity.js';
import { WorkoutSessionOrmEntity } from './workout-session.orm-entity.js';
import { LoggedSetOrmEntity } from './logged-set.orm-entity.js';
let TypeOrmWorkoutSessionRepository = class TypeOrmWorkoutSessionRepository {
    sessionRepo;
    setRepo;
    constructor(sessionRepo, setRepo) {
        this.sessionRepo = sessionRepo;
        this.setRepo = setRepo;
    }
    toDomain(orm) {
        const sets = (orm.sets || []).map((s) => new LoggedSet(s.id, s.exerciseId, s.exerciseName, s.setNumber, s.actualReps, s.actualWeightKg, s.isCompleted));
        return new WorkoutSession(orm.id, orm.athleteId, orm.trainingPlanId, orm.routineId, orm.routineName, new Date(orm.date), orm.completed, sets, orm.notes, orm.rpe, orm.createdAt);
    }
    toOrm(domain) {
        const orm = new WorkoutSessionOrmEntity();
        if (domain.id)
            orm.id = domain.id;
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
            if (s.id)
                setOrm.id = s.id;
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
    async save(session) {
        const orm = this.toOrm(session);
        const saved = await this.sessionRepo.save(orm);
        return this.toDomain(saved);
    }
    async findByAthleteId(athleteId) {
        const list = await this.sessionRepo.find({
            where: { athleteId },
            order: { date: 'DESC' },
        });
        return list.map((s) => this.toDomain(s));
    }
    async findByAthleteAndDate(athleteId, date) {
        const dateStr = date.toISOString().split('T')[0];
        const found = await this.sessionRepo.findOne({
            where: { athleteId, date: dateStr },
        });
        return found ? this.toDomain(found) : null;
    }
    async countCompletedByAthleteInDateRange(athleteId, startDate, endDate) {
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];
        const qb = this.sessionRepo.createQueryBuilder('s');
        qb.where('s.athleteId = :athleteId', { athleteId })
            .andWhere('s.completed = :completed', { completed: true })
            .andWhere('s.date >= :startStr', { startStr })
            .andWhere('s.date <= :endStr', { endStr });
        return qb.getCount();
    }
    async findExerciseMaxHistory(athleteId, exerciseId) {
        const sessions = await this.sessionRepo.find({
            where: { athleteId },
            order: { date: 'ASC' },
        });
        const result = [];
        for (const session of sessions) {
            const matchSets = (session.sets || []).filter((s) => s.exerciseId === exerciseId && s.isCompleted);
            if (matchSets.length > 0) {
                const maxWeight = Math.max(...matchSets.map((s) => s.actualWeightKg));
                const estimated1RMs = matchSets.map((s) => {
                    if (s.actualReps <= 1)
                        return s.actualWeightKg;
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
};
TypeOrmWorkoutSessionRepository = __decorate([
    Injectable(),
    __param(0, InjectRepository(WorkoutSessionOrmEntity)),
    __param(1, InjectRepository(LoggedSetOrmEntity)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], TypeOrmWorkoutSessionRepository);
export { TypeOrmWorkoutSessionRepository };
//# sourceMappingURL=typeorm-workout-session.repository.js.map