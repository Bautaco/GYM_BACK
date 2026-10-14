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
import { ROUTINE_TEMPLATE_REPOSITORY_TOKEN, } from '../domain/routine-template.repository.interface.js';
import { RoutineTemplate } from '../domain/routine-template.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
let RoutineTemplateService = class RoutineTemplateService {
    templateRepo;
    constructor(templateRepo) {
        this.templateRepo = templateRepo;
    }
    async createTemplate(trainerId, dto) {
        const items = dto.exerciseItems.map((item) => new ExerciseItem('', item.exerciseId, item.exerciseName, item.targetSets, item.targetReps, item.targetWeightKg, item.restSeconds, item.notes, item.cadence));
        const template = new RoutineTemplate('', trainerId, dto.name, dto.description, dto.category, items, new Date());
        return this.templateRepo.save(template);
    }
    async getAllTemplates(trainerId) {
        return this.templateRepo.findAll(trainerId);
    }
    async getTemplateById(id) {
        const found = await this.templateRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Plantilla con ID ${id} no encontrada`);
        }
        return found;
    }
    async deleteTemplate(id) {
        const found = await this.templateRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Plantilla con ID ${id} no encontrada`);
        }
        if (this.templateRepo.delete) {
            await this.templateRepo.delete(id);
        }
        return { message: 'Plantilla eliminada correctamente' };
    }
};
RoutineTemplateService = __decorate([
    Injectable(),
    __param(0, Inject(ROUTINE_TEMPLATE_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object])
], RoutineTemplateService);
export { RoutineTemplateService };
//# sourceMappingURL=routine-template.service.js.map