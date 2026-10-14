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
import { Injectable, Inject, BadRequestException, NotFoundException, } from '@nestjs/common';
import { TRAINING_PLAN_REPOSITORY_TOKEN, } from '../domain/training-plan.repository.interface.js';
import { USER_REPOSITORY_TOKEN, } from '../../users/domain/user.repository.interface.js';
import { TrainingPlan } from '../domain/training-plan.entity.js';
import { Routine } from '../domain/routine.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
let TrainingPlanService = class TrainingPlanService {
    planRepo;
    userRepo;
    constructor(planRepo, userRepo) {
        this.planRepo = planRepo;
        this.userRepo = userRepo;
    }
    async createPlan(dto, trainerId, trainerName) {
        if (!dto.athleteId || !dto.name) {
            throw new BadRequestException('El nombre del plan y el atleta asignado son campos obligatorios');
        }
        const athlete = await this.userRepo.findById(dto.athleteId);
        if (!athlete) {
            throw new NotFoundException('El atleta seleccionado no existe en el sistema');
        }
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (endDate < startDate) {
            throw new BadRequestException('La fecha de finalización no puede ser anterior a la fecha de inicio');
        }
        await this.planRepo.deactivatePreviousPlans(dto.athleteId);
        const routines = (dto.routines || []).map((r) => {
            const items = (r.exerciseItems || []).map((i) => new ExerciseItem('', i.exerciseId, i.exerciseName, i.targetSets, i.targetReps, i.targetWeightKg, i.restSeconds || 90, i.notes, i.cadence));
            return new Routine('', r.name, r.dayOfWeek, items, r.description);
        });
        const newPlan = new TrainingPlan('', dto.name.trim(), dto.athleteId, trainerId, startDate, endDate, true, routines, athlete.fullName, trainerName || 'Entrenador', new Date());
        return this.planRepo.save(newPlan);
    }
    async getActivePlanByAthlete(athleteId) {
        return this.planRepo.findActiveByAthleteId(athleteId);
    }
    async getAllPlansByAthlete(athleteId) {
        return this.planRepo.findAllByAthleteId(athleteId);
    }
    async getPlanById(id) {
        const found = await this.planRepo.findById(id);
        if (!found) {
            throw new NotFoundException(`Plan de entrenamiento con ID ${id} no encontrado`);
        }
        return found;
    }
};
TrainingPlanService = __decorate([
    Injectable(),
    __param(0, Inject(TRAINING_PLAN_REPOSITORY_TOKEN)),
    __param(1, Inject(USER_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object, Object])
], TrainingPlanService);
export { TrainingPlanService };
//# sourceMappingURL=training-plan.service.js.map