import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoutineTemplateService } from '../application/routine-template.service.js';
import { CreateRoutineTemplateDto } from './dtos/create-routine-template.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';

@Controller('api/v1/templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoutineTemplateController {
  constructor(private readonly templateService: RoutineTemplateService) {}

  @Get()
  async getTemplates(@CurrentUser() user: any) {
    const trainerId = user.role === UserRole.ENTRENADOR ? user.id : undefined;
    return this.templateService.getAllTemplates(trainerId);
  }

  @Get(':id')
  async getTemplateById(@Param('id') id: string) {
    return this.templateService.getTemplateById(id);
  }

  @Post()
  @Roles(UserRole.ENTRENADOR, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createTemplate(
    @CurrentUser() user: any,
    @Body() dto: CreateRoutineTemplateDto,
  ) {
    return this.templateService.createTemplate(user.id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ENTRENADOR, UserRole.ADMIN)
  async deleteTemplate(@Param('id') id: string) {
    return this.templateService.deleteTemplate(id);
  }
}
