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
import { TrainingPlan } from '../domain/training-plan.entity.js';
import { Routine } from '../domain/routine.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
import { TrainingPlanOrmEntity } from './training-plan.orm-entity.js';
import { RoutineOrmEntity } from './routine.orm-entity.js';
import { ExerciseItemOrmEntity } from './exercise-item.orm-entity.js';
let TypeOrmTrainingPlanRepository = class TypeOrmTrainingPlanRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    toDomain(orm) {
        const routines = (orm.routines || []).map((r) => {
            const items = (r.exerciseItems || []).map((i) => new ExerciseItem(i.id, i.exerciseId, i.exerciseName, i.targetSets, i.targetReps, i.targetWeightKg, i.restSeconds, i.notes, i.cadence));
            return new Routine(r.id, r.name, r.dayOfWeek, items, r.description);
        });
        return new TrainingPlan(orm.id, orm.name, orm.athleteId, orm.trainerId, new Date(orm.startDate), new Date(orm.endDate), orm.isActive, routines, orm.athleteName, orm.trainerName, orm.createdAt);
    }
    toOrm(domain) {
        const orm = new TrainingPlanOrmEntity();
        if (domain.id)
            orm.id = domain.id;
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
            if (r.id)
                routineOrm.id = r.id;
            routineOrm.name = r.name;
            routineOrm.dayOfWeek = r.dayOfWeek;
            routineOrm.description = r.description;
            routineOrm.exerciseItems = (r.exerciseItems || []).map((i) => {
                const itemOrm = new ExerciseItemOrmEntity();
                if (i.id)
                    itemOrm.id = i.id;
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
    async findActiveByAthleteId(athleteId) {
        const found = await this.repo.findOne({
            where: { athleteId, isActive: true },
            order: { createdAt: 'DESC' },
        });
        return found ? this.toDomain(found) : null;
    }
    async findAllByAthleteId(athleteId) {
        const list = await this.repo.find({
            where: { athleteId },
            order: { createdAt: 'DESC' },
        });
        return list.map((p) => this.toDomain(p));
    }
    async findById(id) {
        const found = await this.repo.findOne({ where: { id } });
        return found ? this.toDomain(found) : null;
    }
    async save(plan) {
        const orm = this.toOrm(plan);
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }
    async deactivatePreviousPlans(athleteId) {
        await this.repo.update({ athleteId, isActive: true }, { isActive: false });
    }
};
TypeOrmTrainingPlanRepository = __decorate([
    Injectable(),
    __param(0, InjectRepository(TrainingPlanOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], TypeOrmTrainingPlanRepository);
export { TypeOrmTrainingPlanRepository };
//# sourceMappingURL=typeorm-training-plan.repository.js.map