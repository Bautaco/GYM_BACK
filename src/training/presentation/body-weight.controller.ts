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
import { BodyWeightService } from '../application/body-weight.service.js';
import { LogBodyWeightDto } from './dtos/log-body-weight.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';

@Controller('api/v1/athletes/:athleteId/body-weight')
@UseGuards(JwtAuthGuard)
export class BodyWeightController {
  constructor(private readonly bodyWeightService: BodyWeightService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async logWeight(
    @Param('athleteId') athleteId: string,
    @Body() dto: LogBodyWeightDto,
  ) {
    return this.bodyWeightService.logWeight(athleteId, dto);
  }

  @Get()
  async getWeightHistory(@Param('athleteId') athleteId: string) {
    return this.bodyWeightService.getWeightHistory(athleteId);
  }
}
