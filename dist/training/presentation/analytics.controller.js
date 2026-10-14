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
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getStrengthProgress(athleteId, exerciseId) {
        return this.analyticsService.getStrengthProgress(athleteId, exerciseId);
    }
    async getAdherence(athleteId) {
        return this.analyticsService.getAdherence(athleteId);
    }
};
__decorate([
    Get('strength-progress'),
    __param(0, Param('athleteId')),
    __param(1, Query('exerciseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStrengthProgress", null);
__decorate([
    Get('adherence'),
    __param(0, Param('athleteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAdherence", null);
AnalyticsController = __decorate([
    Controller('api/v1/analytics/athletes/:athleteId'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [AnalyticsService])
], AnalyticsController);
export { AnalyticsController };
//# sourceMappingURL=analytics.controller.js.map