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
import { Controller, Get, Post, Body, Param, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { TrainingPlanService } from '../application/training-plan.service.js';
import { CreateTrainingPlanDto } from './dtos/create-training-plan.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';
let TrainingPlanController = class TrainingPlanController {
    planService;
    constructor(planService) {
        this.planService = planService;
    }
    async getActivePlanByAthlete(athleteId) {
        return this.planService.getActivePlanByAthlete(athleteId);
    }
    async getAllPlansByAthlete(athleteId) {
        return this.planService.getAllPlansByAthlete(athleteId);
    }
    async getById(id) {
        return this.planService.getPlanById(id);
    }
    async createPlan(dto, user) {
        return this.planService.createPlan(dto, user.id, user.fullName);
    }
};
__decorate([
    Get('athlete/:athleteId'),
    __param(0, Param('athleteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrainingPlanController.prototype, "getActivePlanByAthlete", null);
__decorate([
    Get('athlete/:athleteId/all'),
    __param(0, Param('athleteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrainingPlanController.prototype, "getAllPlansByAthlete", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrainingPlanController.prototype, "getById", null);
__decorate([
    Post(),
    Roles(UserRole.ENTRENADOR),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTrainingPlanDto, Object]),
    __metadata("design:returntype", Promise)
], TrainingPlanController.prototype, "createPlan", null);
TrainingPlanController = __decorate([
    Controller('api/v1/training-plans'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [TrainingPlanService])
], TrainingPlanController);
export { TrainingPlanController };
//# sourceMappingURL=training-plan.controller.js.map