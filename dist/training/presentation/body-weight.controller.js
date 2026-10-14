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
import { BodyWeightService } from '../application/body-weight.service.js';
import { LogBodyWeightDto } from './dtos/log-body-weight.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
let BodyWeightController = class BodyWeightController {
    bodyWeightService;
    constructor(bodyWeightService) {
        this.bodyWeightService = bodyWeightService;
    }
    async logWeight(athleteId, dto) {
        return this.bodyWeightService.logWeight(athleteId, dto);
    }
    async getWeightHistory(athleteId) {
        return this.bodyWeightService.getWeightHistory(athleteId);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    __param(0, Param('athleteId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, LogBodyWeightDto]),
    __metadata("design:returntype", Promise)
], BodyWeightController.prototype, "logWeight", null);
__decorate([
    Get(),
    __param(0, Param('athleteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BodyWeightController.prototype, "getWeightHistory", null);
BodyWeightController = __decorate([
    Controller('api/v1/athletes/:athleteId/body-weight'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [BodyWeightService])
], BodyWeightController);
export { BodyWeightController };
//# sourceMappingURL=body-weight.controller.js.map