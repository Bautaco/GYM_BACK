import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TrainingPlanService } from '../application/training-plan.service.js';
import { CreateTrainingPlanDto } from './dtos/create-training-plan.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';

@Controller('api/v1/training-plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingPlanController {
  constructor(private readonly planService: TrainingPlanService) {}

  @Get('athlete/:athleteId')
  async getActivePlanByAthlete(@Param('athleteId') athleteId: string) {
    return this.planService.getActivePlanByAthlete(athleteId);
  }

  @Get('athlete/:athleteId/all')
  async getAllPlansByAthlete(@Param('athleteId') athleteId: string) {
    return this.planService.getAllPlansByAthlete(athleteId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.planService.getPlanById(id);
  }

  @Post()
  @Roles(UserRole.ENTRENADOR)
  @HttpCode(HttpStatus.CREATED)
  async createPlan(
    @Body() dto: CreateTrainingPlanDto,
    @CurrentUser() user: any,
  ) {
    return this.planService.createPlan(dto, user.id, user.fullName);
  }
}
