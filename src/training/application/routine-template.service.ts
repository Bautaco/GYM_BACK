import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IRoutineTemplateRepository,
  ROUTINE_TEMPLATE_REPOSITORY_TOKEN,
} from '../domain/routine-template.repository.interface.js';
import { RoutineTemplate } from '../domain/routine-template.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
import { CreateRoutineTemplateDto } from '../presentation/dtos/create-routine-template.dto.js';

@Injectable()
export class RoutineTemplateService {
  constructor(
    @Inject(ROUTINE_TEMPLATE_REPOSITORY_TOKEN)
    private readonly templateRepo: IRoutineTemplateRepository,
  ) {}

  async createTemplate(
    trainerId: string,
    dto: CreateRoutineTemplateDto,
  ): Promise<RoutineTemplate> {
    const items = dto.exerciseItems.map(
      (item) =>
        new ExerciseItem(
          '',
          item.exerciseId,
          item.exerciseName,
          item.targetSets,
          item.targetReps,
          item.targetWeightKg,
          item.restSeconds,
          item.notes,
          item.cadence,
        ),
    );

    const template = new RoutineTemplate(
      '',
      trainerId,
      dto.name,
      dto.description,
      dto.category,
      items,
      new Date(),
    );

    return this.templateRepo.save(template);
  }

  async getAllTemplates(trainerId?: string): Promise<RoutineTemplate[]> {
    return this.templateRepo.findAll(trainerId);
  }

  async getTemplateById(id: string): Promise<RoutineTemplate> {
    const found = await this.templateRepo.findById(id);
    if (!found) {
      throw new NotFoundException(`Plantilla con ID ${id} no encontrada`);
    }
    return found;
  }

  async deleteTemplate(id: string): Promise<{ message: string }> {
    const found = await this.templateRepo.findById(id);
    if (!found) {
      throw new NotFoundException(`Plantilla con ID ${id} no encontrada`);
    }
    if (this.templateRepo.delete) {
      await this.templateRepo.delete(id);
    }
    return { message: 'Plantilla eliminada correctamente' };
  }
}
