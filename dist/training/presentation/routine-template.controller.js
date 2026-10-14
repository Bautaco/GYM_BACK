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
import { Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { RoutineTemplateService } from '../application/routine-template.service.js';
import { CreateRoutineTemplateDto } from './dtos/create-routine-template.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';
let RoutineTemplateController = class RoutineTemplateController {
    templateService;
    constructor(templateService) {
        this.templateService = templateService;
    }
    async getTemplates(user) {
        const trainerId = user.role === UserRole.ENTRENADOR ? user.id : undefined;
        return this.templateService.getAllTemplates(trainerId);
    }
    async getTemplateById(id) {
        return this.templateService.getTemplateById(id);
    }
    async createTemplate(user, dto) {
        return this.templateService.createTemplate(user.id, dto);
    }
    async deleteTemplate(id) {
        return this.templateService.deleteTemplate(id);
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutineTemplateController.prototype, "getTemplates", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoutineTemplateController.prototype, "getTemplateById", null);
__decorate([
    Post(),
    Roles(UserRole.ENTRENADOR, UserRole.ADMIN),
    HttpCode(HttpStatus.CREATED),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateRoutineTemplateDto]),
    __metadata("design:returntype", Promise)
], RoutineTemplateController.prototype, "createTemplate", null);
__decorate([
    Delete(':id'),
    Roles(UserRole.ENTRENADOR, UserRole.ADMIN),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoutineTemplateController.prototype, "deleteTemplate", null);
RoutineTemplateController = __decorate([
    Controller('api/v1/templates'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [RoutineTemplateService])
], RoutineTemplateController);
export { RoutineTemplateController };
//# sourceMappingURL=routine-template.controller.js.map