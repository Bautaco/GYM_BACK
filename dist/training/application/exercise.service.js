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
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EXERCISE_REPOSITORY_TOKEN } from '../domain/exercise.repository.interface.js';
import { Exercise } from '../domain/exercise.entity.js';
let ExerciseService = class ExerciseService {
    exerciseRepo;
    constructor(exerciseRepo) {
        this.exerciseRepo = exerciseRepo;
    }
    async getAllExercises() {
        return this.exerciseRepo.findAll();
    }
    async getExerciseById(id) {
        const found = await this.exerciseRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
        }
        return found;
    }
    async createExercise(dto) {
        const exercise = new Exercise('', dto.nombre.trim(), dto.grupoMuscularPrincipal.trim(), dto.zonasTrabajadas, dto.descripcion.trim(), dto.videoUrl?.trim(), new Date());
        return this.exerciseRepo.save(exercise);
    }
    async updateExercise(id, dto) {
        const found = await this.exerciseRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
        }
        if (dto.nombre !== undefined)
            found.nombre = dto.nombre.trim();
        if (dto.grupoMuscularPrincipal !== undefined)
            found.grupoMuscularPrincipal = dto.grupoMuscularPrincipal.trim();
        if (dto.zonasTrabajadas !== undefined)
            found.zonasTrabajadas = dto.zonasTrabajadas;
        if (dto.descripcion !== undefined)
            found.descripcion = dto.descripcion.trim();
        if (dto.videoUrl !== undefined)
            found.videoUrl = dto.videoUrl?.trim() || undefined;
        return this.exerciseRepo.save(found);
    }
    async deleteExercise(id) {
        const found = await this.exerciseRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
        }
        await this.exerciseRepo.delete(id);
    }
};
ExerciseService = __decorate([
    Injectable(),
    __param(0, Inject(EXERCISE_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object])
], ExerciseService);
export { ExerciseService };
//# sourceMappingURL=exercise.service.js.map