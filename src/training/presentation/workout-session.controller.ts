import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkoutSessionService } from '../application/workout-session.service.js';
import { LogWorkoutSessionDto } from './dtos/log-workout-session.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';

@Controller('api/v1/training-sessions')
@UseGuards(JwtAuthGuard)
export class WorkoutSessionController {
  constructor(private readonly sessionService: WorkoutSessionService) {}

  @Post('log')
  @HttpCode(HttpStatus.CREATED)
  async logSession(@Body() dto: LogWorkoutSessionDto) {
    return this.sessionService.logSession(dto);
  }

  @Get('athlete/:athleteId')
  async getAthleteSessions(@Param('athleteId') athleteId: string) {
    return this.sessionService.getSessionsByAthlete(athleteId);
  }
}
