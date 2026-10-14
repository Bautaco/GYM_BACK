import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';

@Controller('api/v1/analytics/athletes/:athleteId')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('strength-progress')
  async getStrengthProgress(
    @Param('athleteId') athleteId: string,
    @Query('exerciseId') exerciseId: string,
  ) {
    return this.analyticsService.getStrengthProgress(athleteId, exerciseId);
  }

  @Get('adherence')
  async getAdherence(@Param('athleteId') athleteId: string) {
    return this.analyticsService.getAdherence(athleteId);
  }
}
