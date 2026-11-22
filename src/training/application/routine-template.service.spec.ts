import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RoutineTemplateService } from './routine-template.service.js';
import { RoutineTemplate } from '../domain/routine-template.entity.js';
import { ExerciseItem } from '../domain/exercise-item.entity.js';
import { NotFoundException } from '@nestjs/common';

describe('RoutineTemplateService (Unit)', () => {
  let service: RoutineTemplateService;
  let mockTemplateRepo: any;

  beforeEach(() => {
    mockTemplateRepo = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    };
    service = new RoutineTemplateService(mockTemplateRepo);
  });

  it('createTemplate: crea una plantilla con sus ejercicios y series correspondientes', async () => {
    const item = new ExerciseItem('', 'ex-1', 'Press Militar', 4, 10, 50, 90);
    const template = new RoutineTemplate('tpl-1', 'tr-1', 'Rutina Hombros', 'Empuje vertical', 'Fuerza', [item], new Date());
    mockTemplateRepo.save.mockResolvedValue(template);

    const result = await service.createTemplate('tr-1', {
      name: 'Rutina Hombros',
      description: 'Empuje vertical',
      category: 'Fuerza',
      exerciseItems: [
        {
          exerciseId: 'ex-1',
          exerciseName: 'Press Militar',
          targetSets: 4,
          targetReps: 10,
          targetWeightKg: 50,
          restSeconds: 90,
        },
      ],
    });

    expect(result.id).toBe('tpl-1');
    expect(result.name).toBe('Rutina Hombros');
    expect(result.exerciseItems).toHaveLength(1);
    expect(mockTemplateRepo.save).toHaveBeenCalled();
  });

  it('getAllTemplates: retorna todas las plantillas registradas filtradas por entrenador', async () => {
    const tpl1 = new RoutineTemplate('tpl-1', 'tr-1', 'Rutina A', '', 'Hipertrofia', [], new Date());
    mockTemplateRepo.findAll.mockResolvedValue([tpl1]);

    const result = await service.getAllTemplates('tr-1');
    expect(result).toHaveLength(1);
    expect(mockTemplateRepo.findAll).toHaveBeenCalledWith('tr-1');
  });

  it('getTemplateById: retorna la plantilla solicitada si existe', async () => {
    const tpl = new RoutineTemplate('tpl-1', 'tr-1', 'Rutina A', '', 'Hipertrofia', [], new Date());
    mockTemplateRepo.findById.mockResolvedValue(tpl);

    const result = await service.getTemplateById('tpl-1');
    expect(result.name).toBe('Rutina A');
  });

  it('getTemplateById: lanza NotFoundException si la plantilla no existe', async () => {
    mockTemplateRepo.findById.mockResolvedValue(null);

    await expect(service.getTemplateById('non-existent')).rejects.toThrow(NotFoundException);
  });

  it('deleteTemplate: elimina la plantilla tras verificar su existencia', async () => {
    const tpl = new RoutineTemplate('tpl-1', 'tr-1', 'Rutina A', '', 'Hipertrofia', [], new Date());
    mockTemplateRepo.findById.mockResolvedValue(tpl);
    mockTemplateRepo.delete.mockResolvedValue(undefined);

    await service.deleteTemplate('tpl-1');
    expect(mockTemplateRepo.delete).toHaveBeenCalledWith('tpl-1');
  });
});
