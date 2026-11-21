import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExerciseService } from './exercise.service.js';
import { Exercise } from '../domain/exercise.entity.js';
import { NotFoundException } from '@nestjs/common';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let mockExerciseRepo: any;
  let mockMuscleGroupRepo: any;
  let mockTargetZoneRepo: any;

  const makeExercise = (overrides: Partial<Exercise> = {}): Exercise =>
    new Exercise(
      overrides.id ?? 'ex-1',
      overrides.nombre ?? 'Press de Banca',
      overrides.grupoMuscularPrincipal ?? 'Pecho',
      overrides.zonasTrabajadas ?? ['Pectoral Mayor'],
      overrides.descripcion ?? 'Empuje horizontal.',
      overrides.videoUrl,
      overrides.createdAt ?? new Date('2026-01-01'),
    );

  beforeEach(() => {
    mockExerciseRepo = {
      findAll: vi.fn().mockResolvedValue([
        makeExercise(),
        makeExercise({ id: 'ex-2', nombre: 'Sentadilla', grupoMuscularPrincipal: 'Piernas', zonasTrabajadas: ['Cuádriceps'] }),
      ]),
      findById: vi.fn(),
      save: vi.fn().mockImplementation((e) => Promise.resolve({ ...e, id: e.id || 'ex-new' })),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    mockMuscleGroupRepo = {
      find: vi.fn().mockResolvedValue([{ id: 'g1', name: 'Piernas' }]),
      create: vi.fn().mockImplementation((dto) => dto),
      save: vi.fn().mockImplementation((entity) => Promise.resolve({ id: 'g-new', ...entity })),
    };

    mockTargetZoneRepo = {
      find: vi.fn().mockResolvedValue([{ id: 'z1', name: 'Cuádriceps' }]),
      create: vi.fn().mockImplementation((dto) => dto),
      save: vi.fn().mockImplementation((entity) => Promise.resolve({ id: 'z-new', ...entity })),
    };

    service = new ExerciseService(mockExerciseRepo, mockMuscleGroupRepo, mockTargetZoneRepo);
  });

  // ─── getMuscleGroups ───────────────────────────────────────────────────
  describe('getMuscleGroups()', () => {
    it('CP-EX-01: Fusiona grupos de la tabla, de ejercicios existentes y valores base', async () => {
      const groups = await service.getMuscleGroups();
      expect(groups).toContain('Piernas'); // de la tabla
      expect(groups).toContain('Pecho');   // de ejercicios existentes
      expect(groups).toContain('Espalda'); // valor base
      expect(groups).toContain('Core');    // valor base
    });

    it('CP-EX-02: Devuelve la lista ordenada alfabéticamente en español', async () => {
      const groups = await service.getMuscleGroups();
      const sorted = [...groups].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
      expect(groups).toEqual(sorted);
    });
  });

  // ─── createExercise ────────────────────────────────────────────────────
  describe('createExercise()', () => {
    it('CP-EX-03: Crea un ejercicio y persiste el grupo muscular nuevo automáticamente', async () => {
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

    it('CP-EX-04: Crea un ejercicio con URL de video', async () => {
      const created = await service.createExercise({
        nombre: 'Sentadilla Búlgara',
        grupoMuscularPrincipal: 'Piernas',
        zonasTrabajadas: ['Cuádriceps', 'Glúteo'],
        descripcion: 'Pie trasero en banco.',
        videoUrl: 'https://www.youtube.com/watch?v=abc123',
      });
      expect(created.videoUrl).toBe('https://www.youtube.com/watch?v=abc123');
    });

    it('CP-EX-05: Crea ejercicio sin video (videoUrl undefined/null) correctamente', async () => {
      const created = await service.createExercise({
        nombre: 'Plancha Frontal',
        grupoMuscularPrincipal: 'Core',
        zonasTrabajadas: ['Abdomen'],
        descripcion: 'Sostener posición isométrica.',
        videoUrl: undefined,
      });
      expect(created.videoUrl).toBeUndefined();
    });

    it('CP-EX-06: Usa el grupo muscular como zona trabajada si se pasa un array vacío', async () => {
      const created = await service.createExercise({
        nombre: 'Remo con Barra',
        grupoMuscularPrincipal: 'Espalda',
        zonasTrabajadas: [],
        descripcion: 'Jalón hacia el abdomen.',
      });
      expect(created.zonasTrabajadas).toContain('Espalda');
    });
  });

  // ─── updateExercise ────────────────────────────────────────────────────
  describe('updateExercise()', () => {
    it('CP-EX-07: Actualiza el nombre y la descripción de un ejercicio existente', async () => {
      const original = makeExercise({ videoUrl: 'https://yt.com/v=xyz' });
      mockExerciseRepo.findById.mockResolvedValue(original);
      mockExerciseRepo.save.mockImplementation((e: Exercise) => Promise.resolve(e));

      const updated = await service.updateExercise('ex-1', {
        nombre: 'Press de Banca Inclinado',
        descripcion: 'Pecho superior.',
      });

      expect(updated.nombre).toBe('Press de Banca Inclinado');
      expect(updated.descripcion).toBe('Pecho superior.');
      // Video intacto porque no se tocó
      expect(updated.videoUrl).toBe('https://yt.com/v=xyz');
    });

    it('CP-EX-08: Borra el video cuando se envía videoUrl = null (usuario elimina el link)', async () => {
      const original = makeExercise({ videoUrl: 'https://youtube.com/watch?v=orig' });
      mockExerciseRepo.findById.mockResolvedValue(original);
      mockExerciseRepo.save.mockImplementation((e: Exercise) => Promise.resolve(e));

      const updated = await service.updateExercise('ex-1', { videoUrl: null });

      expect((updated as any).videoUrl).toBeNull();
    });

    it('CP-EX-09: Borra el video cuando se envía videoUrl = "" (campo vacío)', async () => {
      const original = makeExercise({ videoUrl: 'https://youtube.com/watch?v=orig' });
      mockExerciseRepo.findById.mockResolvedValue(original);
      mockExerciseRepo.save.mockImplementation((e: Exercise) => Promise.resolve(e));

      const updated = await service.updateExercise('ex-1', { videoUrl: '' });

      expect((updated as any).videoUrl).toBeNull();
    });

    it('CP-EX-10: Actualiza el video con una URL válida nueva', async () => {
      const original = makeExercise({ videoUrl: undefined });
      mockExerciseRepo.findById.mockResolvedValue(original);
      mockExerciseRepo.save.mockImplementation((e: Exercise) => Promise.resolve(e));

      const updated = await service.updateExercise('ex-1', {
        videoUrl: 'https://www.youtube.com/shorts/abcde',
      });

      expect(updated.videoUrl).toBe('https://www.youtube.com/shorts/abcde');
    });

    it('CP-EX-11: Lanza NotFoundException si el ejercicio no existe', async () => {
      mockExerciseRepo.findById.mockResolvedValue(null);
      await expect(service.updateExercise('non-existing', { nombre: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  // ─── deleteExercise ────────────────────────────────────────────────────
  describe('deleteExercise()', () => {
    it('CP-EX-12: Elimina el ejercicio existente correctamente', async () => {
      mockExerciseRepo.findById.mockResolvedValue(makeExercise());
      await expect(service.deleteExercise('ex-1')).resolves.toBeUndefined();
      expect(mockExerciseRepo.delete).toHaveBeenCalledWith('ex-1');
    });

    it('CP-EX-13: Lanza NotFoundException al intentar borrar un ejercicio inexistente', async () => {
      mockExerciseRepo.findById.mockResolvedValue(null);
      await expect(service.deleteExercise('ghost-id')).rejects.toThrow(NotFoundException);
    });
  });
});
