import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExerciseService } from '../application/exercise.service.js';
import { CreateExerciseDto } from './dtos/create-exercise.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';

@Controller('api/v1/exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  async getAll() {
    return this.exerciseService.getAllExercises();
  }

  @Get('muscle-groups')
  async getMuscleGroups() {
    return this.exerciseService.getMuscleGroups();
  }

  @Get('target-zones')
  async getTargetZones() {
    return this.exerciseService.getTargetZones();
  }

  @Post('muscle-groups')
  @Roles(UserRole.ENTRENADOR)
  @HttpCode(HttpStatus.CREATED)
  async createMuscleGroup(@Body('name') name: string) {
    const created = await this.exerciseService.createMuscleGroup(name);
    return { name: created };
  }

  @Post('target-zones')
  @Roles(UserRole.ENTRENADOR)
  @HttpCode(HttpStatus.CREATED)
  async createTargetZone(
    @Body('name') name: string,
    @Body('muscleGroupName') muscleGroupName?: string,
  ) {
    const created = await this.exerciseService.createTargetZone(name, muscleGroupName);
    return { name: created };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.exerciseService.getExerciseById(id);
  }

  @Post()
  @Roles(UserRole.ENTRENADOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateExerciseDto) {
    return this.exerciseService.createExercise(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ENTRENADOR)
  async update(@Param('id') id: string, @Body() dto: Partial<CreateExerciseDto>) {
    return this.exerciseService.updateExercise(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ENTRENADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.exerciseService.deleteExercise(id);
  }
}
