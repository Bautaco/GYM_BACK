import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExerciseService } from './exercise.service.js';
import { Exercise } from '../domain/exercise.entity.js';

describe('ExerciseService - Dynamic Muscle Groups & Zones', () => {
  let service: ExerciseService;
  let mockExerciseRepo: any;
  let mockMuscleGroupRepo: any;
  let mockTargetZoneRepo: any;

  beforeEach(() => {
    mockExerciseRepo = {
      findAll: vi.fn().mockResolvedValue([
        new Exercise('1', 'Press de Banca', 'Pecho', ['Pectoral Mayor'], 'Desc'),
      ]),
      findById: vi.fn(),
      save: vi.fn().mockImplementation((e) => Promise.resolve({ ...e, id: 'ex-123' })),
      delete: vi.fn(),
    };

    mockMuscleGroupRepo = {
      find: vi.fn().mockResolvedValue([{ id: 'g1', name: 'Piernas' }]),
      create: vi.fn().mockImplementation((dto) => dto),
      save: vi.fn().mockImplementation((entity) => Promise.resolve({ id: 'new-id', ...entity })),
    };

    mockTargetZoneRepo = {
      find: vi.fn().mockResolvedValue([{ id: 'z1', name: 'Cuádriceps' }]),
      create: vi.fn().mockImplementation((dto) => dto),
      save: vi.fn().mockImplementation((entity) => Promise.resolve({ id: 'new-z-id', ...entity })),
    };

    service = new ExerciseService(
      mockExerciseRepo,
      mockMuscleGroupRepo,
      mockTargetZoneRepo,
    );
  });

  it('debe listar los grupos musculares fusionando la tabla con ejercicios existentes y valores base', async () => {
    const groups = await service.getMuscleGroups();
    expect(groups).toContain('Piernas');
    expect(groups).toContain('Pecho');
    expect(groups).toContain('Espalda');
  });

  it('debe registrar automáticamente nuevos grupos musculares y zonas al crear un ejercicio', async () => {
    const created = await service.createExercise({
      nombre: 'Fondos en Paralelas',
      grupoMuscularPrincipal: 'Brazos Superiores',
      zonasTrabajadas: ['Tríceps Cabeza Larga', 'Pectoral Inferior'],
      descripcion: 'Bajar a 90 grados y subir.',
    });

    expect(created.nombre).toBe('Fondos en Paralelas');
    expect(mockMuscleGroupRepo.save).toHaveBeenCalled();
    expect(mockTargetZoneRepo.save).toHaveBeenCalled();
    expect(mockExerciseRepo.save).toHaveBeenCalled();
  });
});
