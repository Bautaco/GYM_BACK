import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';

@Controller('api/v1/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin/overview')
  @Roles(UserRole.ADMIN)
  async getAdminExecutiveOverview(
    @Query('period') period?: 'all' | '30d' | '90d' | '365d',
    @Query('trainerId') trainerId?: string,
    @Query('adherenceRange') adherenceRange?: 'all' | 'green' | 'yellow' | 'red',
  ) {
    return this.analyticsService.getAdminExecutiveOverview({
      period,
      trainerId,
      adherenceRange,
    });
  }

  @Get('athletes/:athleteId/strength-progress')
  async getStrengthProgress(
    @Param('athleteId') athleteId: string,
    @Query('exerciseId') exerciseId: string,
    @CurrentUser() user: any,
  ) {
    await this.analyticsService.validateAthleteAccess(athleteId, user);
    return this.analyticsService.getStrengthProgress(athleteId, exerciseId);
  }

  @Get('athletes/:athleteId/adherence')
  async getAdherence(
    @Param('athleteId') athleteId: string,
    @CurrentUser() user: any,
  ) {
    await this.analyticsService.validateAthleteAccess(athleteId, user);
    return this.analyticsService.getAdherence(athleteId);
  }
}
