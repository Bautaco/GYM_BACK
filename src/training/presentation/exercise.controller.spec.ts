import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExerciseController } from './exercise.controller.js';
import { ExerciseService } from '../application/exercise.service.js';
import { Exercise } from '../domain/exercise.entity.js';

describe('ExerciseController', () => {
  let controller: ExerciseController;
  let mockService: Partial<ExerciseService>;

  beforeEach(() => {
    mockService = {
      getAllExercises: vi.fn().mockResolvedValue([
        new Exercise('1', 'Press Banca', 'Pecho', ['Pectoral'], 'Desc', 'https://video.com'),
      ]),
      getExerciseById: vi.fn().mockImplementation((id: string) =>
        Promise.resolve(new Exercise(id, 'Press Banca', 'Pecho', ['Pectoral'], 'Desc', undefined))
      ),
      getMuscleGroups: vi.fn().mockResolvedValue(['Pecho', 'Piernas', 'Espalda']),
      getTargetZones: vi.fn().mockResolvedValue(['Cuádriceps', 'Glúteos']),
      createMuscleGroup: vi.fn().mockResolvedValue('Trapecio'),
      createTargetZone: vi.fn().mockResolvedValue('Trapecio Superior'),
      createExercise: vi.fn().mockImplementation((dto) =>
        Promise.resolve({ id: 'ex-new', ...dto })
      ),
      updateExercise: vi.fn().mockImplementation((id, dto) =>
        Promise.resolve({ id, ...dto })
      ),
      deleteExercise: vi.fn().mockResolvedValue(undefined),
    };

    controller = new ExerciseController(mockService as ExerciseService);
  });

  it('getAll retorna la lista de ejercicios', async () => {
    const result = await controller.getAll();
    expect(result.length).toBe(1);
    expect(result[0].nombre).toBe('Press Banca');
    expect(mockService.getAllExercises).toHaveBeenCalled();
  });

  it('getById retorna el ejercicio solicitado', async () => {
    const result = await controller.getById('123');
    expect(result.id).toBe('123');
    expect(mockService.getExerciseById).toHaveBeenCalledWith('123');
  });

  it('getMuscleGroups y getTargetZones delegan correctamente al servicio', async () => {
    const groups = await controller.getMuscleGroups();
    expect(groups).toContain('Pecho');

    const zones = await controller.getTargetZones();
    expect(zones).toContain('Cuádriceps');
  });

  it('createMuscleGroup y createTargetZone crean y retornan el nombre', async () => {
    const g = await controller.createMuscleGroup('Trapecio');
    expect(g).toEqual({ name: 'Trapecio' });

    const z = await controller.createTargetZone('Trapecio Superior', 'Espalda');
    expect(z).toEqual({ name: 'Trapecio Superior' });
  });

  it('create delega al servicio con el DTO completo', async () => {
    const dto = {
      nombre: 'Sentadilla Hack',
      grupoMuscularPrincipal: 'Piernas',
      zonasTrabajadas: ['Cuádriceps'],
      descripcion: 'Máquina guiada',
      videoUrl: 'https://youtube.com/watch?v=hack',
    };
    const created = await controller.create(dto as any);
    expect(created.nombre).toBe('Sentadilla Hack');
    expect(mockService.createExercise).toHaveBeenCalledWith(dto);
  });

  it('update maneja actualización cuando se borra el videoUrl enviando null', async () => {
    const patchDto = { videoUrl: null };
    const updated = await controller.update('ex-1', patchDto as any);
    expect(mockService.updateExercise).toHaveBeenCalledWith('ex-1', patchDto);
    expect((updated as any).videoUrl).toBeNull();
  });

  it('delete delega la eliminación al servicio', async () => {
    await controller.delete('ex-1');
    expect(mockService.deleteExercise).toHaveBeenCalledWith('ex-1');
  });
});
