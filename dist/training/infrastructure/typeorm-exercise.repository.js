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
import { Exercise } from '../domain/exercise.entity.js';
import { ExerciseOrmEntity } from './exercise.orm-entity.js';
let TypeOrmExerciseRepository = class TypeOrmExerciseRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    toDomain(orm) {
        return new Exercise(orm.id, orm.nombre, orm.grupoMuscularPrincipal, orm.zonasTrabajadas || [], orm.descripcion, orm.videoUrl, orm.createdAt);
    }
    toOrm(domain) {
        const orm = new ExerciseOrmEntity();
        if (domain.id)
            orm.id = domain.id;
        orm.nombre = domain.nombre;
        orm.grupoMuscularPrincipal = domain.grupoMuscularPrincipal;
        orm.zonasTrabajadas = domain.zonasTrabajadas;
        orm.descripcion = domain.descripcion;
        orm.videoUrl = domain.videoUrl;
        return orm;
    }
    async findAll() {
        const list = await this.repo.find({ order: { nombre: 'ASC' } });
        return list.map((e) => this.toDomain(e));
    }
    async findById(id) {
        const found = await this.repo.findOne({ where: { id } });
        return found ? this.toDomain(found) : null;
    }
    async save(exercise) {
        const orm = this.toOrm(exercise);
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }
    async delete(id) {
        await this.repo.delete(id);
    }
    async count() {
        return this.repo.count();
    }
};
TypeOrmExerciseRepository = __decorate([
    Injectable(),
    __param(0, InjectRepository(ExerciseOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], TypeOrmExerciseRepository);
export { TypeOrmExerciseRepository };
//# sourceMappingURL=typeorm-exercise.repository.js.map