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
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { ExerciseService } from '../application/exercise.service.js';
import { CreateExerciseDto } from './dtos/create-exercise.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';
let ExerciseController = class ExerciseController {
    exerciseService;
    constructor(exerciseService) {
        this.exerciseService = exerciseService;
    }
    async getAll() {
        return this.exerciseService.getAllExercises();
    }
    async getMuscleGroups() {
        return this.exerciseService.getMuscleGroups();
    }
    async getTargetZones() {
        return this.exerciseService.getTargetZones();
    }
    async createMuscleGroup(name) {
        const created = await this.exerciseService.createMuscleGroup(name);
        return { name: created };
    }
    async createTargetZone(name, muscleGroupName) {
        const created = await this.exerciseService.createTargetZone(name, muscleGroupName);
        return { name: created };
    }
    async getById(id) {
        return this.exerciseService.getExerciseById(id);
    }
    async create(dto) {
        return this.exerciseService.createExercise(dto);
    }
    async update(id, dto) {
        return this.exerciseService.updateExercise(id, dto);
    }
    async delete(id) {
        return this.exerciseService.deleteExercise(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "getAll", null);
__decorate([
    Get('muscle-groups'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "getMuscleGroups", null);
__decorate([
    Get('target-zones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "getTargetZones", null);
__decorate([
    Post('muscle-groups'),
    Roles(UserRole.ENTRENADOR),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "createMuscleGroup", null);
__decorate([
    Post('target-zones'),
    Roles(UserRole.ENTRENADOR),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body('name')),
    __param(1, Body('muscleGroupName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "createTargetZone", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "getById", null);
__decorate([
    Post(),
    Roles(UserRole.ENTRENADOR),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateExerciseDto]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "create", null);
__decorate([
    Patch(':id'),
    Roles(UserRole.ENTRENADOR),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(UserRole.ENTRENADOR),
    HttpCode(HttpStatus.NO_CONTENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExerciseController.prototype, "delete", null);
ExerciseController = __decorate([
    Controller('api/v1/exercises'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [ExerciseService])
], ExerciseController);
export { ExerciseController };
//# sourceMappingURL=exercise.controller.js.map