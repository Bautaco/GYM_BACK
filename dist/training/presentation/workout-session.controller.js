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
import { Controller, Post, Get, Body, Param, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { WorkoutSessionService } from '../application/workout-session.service.js';
import { LogWorkoutSessionDto } from './dtos/log-workout-session.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
let WorkoutSessionController = class WorkoutSessionController {
    sessionService;
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async logSession(dto) {
        return this.sessionService.logSession(dto);
    }
    async getAthleteSessions(athleteId) {
        return this.sessionService.getSessionsByAthlete(athleteId);
    }
};
__decorate([
    Post('log'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LogWorkoutSessionDto]),
    __metadata("design:returntype", Promise)
], WorkoutSessionController.prototype, "logSession", null);
__decorate([
    Get('athlete/:athleteId'),
    __param(0, Param('athleteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkoutSessionController.prototype, "getAthleteSessions", null);
WorkoutSessionController = __decorate([
    Controller('api/v1/training-sessions'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [WorkoutSessionService])
], WorkoutSessionController);
export { WorkoutSessionController };
//# sourceMappingURL=workout-session.controller.js.map