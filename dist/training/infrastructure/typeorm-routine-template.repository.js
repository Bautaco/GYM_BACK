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
import { RoutineTemplate } from '../domain/routine-template.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
import { RoutineTemplateOrmEntity } from './routine-template.orm-entity.js';
let TypeOrmRoutineTemplateRepository = class TypeOrmRoutineTemplateRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    toDomain(orm) {
        const items = (orm.exerciseItemsJson || []).map((i) => new ExerciseItem(i.id || '', i.exerciseId, i.exerciseName, i.targetSets, i.targetReps, i.targetWeightKg, i.restSeconds, i.notes, i.cadence));
        return new RoutineTemplate(orm.id, orm.trainerId, orm.name, orm.description, orm.category, items, orm.createdAt);
    }
    toOrm(domain) {
        const orm = new RoutineTemplateOrmEntity();
        if (domain.id)
            orm.id = domain.id;
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
    async save(template) {
        const orm = this.toOrm(template);
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }
    async findById(id) {
        const found = await this.repo.findOne({ where: { id } });
        return found ? this.toDomain(found) : null;
    }
    async findAll(trainerId) {
        let list;
        if (trainerId) {
            list = await this.repo.find({
                where: [{ trainerId }, { trainerId: 'SYSTEM' }],
                order: { name: 'ASC' },
            });
        }
        else {
            list = await this.repo.find({ order: { name: 'ASC' } });
        }
        return list.map((orm) => this.toDomain(orm));
    }
    async delete(id) {
        await this.repo.delete(id);
    }
    async count() {
        return this.repo.count();
    }
};
TypeOrmRoutineTemplateRepository = __decorate([
    Injectable(),
    __param(0, InjectRepository(RoutineTemplateOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], TypeOrmRoutineTemplateRepository);
export { TypeOrmRoutineTemplateRepository };
//# sourceMappingURL=typeorm-routine-template.repository.js.map