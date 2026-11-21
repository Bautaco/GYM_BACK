import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkoutSessionService } from './workout-session.service.js';
import { BadRequestException } from '@nestjs/common';
import { WorkoutSession } from '../domain/workout-session.entity.js';
import { LoggedSet } from '../domain/logged-set.entity.js';

describe('WorkoutSessionService (HU-03)', () => {
  let service: WorkoutSessionService;
  let mockSessionRepo: any;

  const baseDto = () => ({
    athleteId: 'athlete-1',
    trainingPlanId: 'plan-1',
    routineId: 'routine-1',
    routineName: 'Día 1: Piernas',
    date: '2026-10-13',
    completed: true,
    rpe: 7,
    durationMinutes: 60,
    sets: [
      {
        exerciseId: 'ex-squat',
        exerciseName: 'Sentadilla Profunda',
        setNumber: 1,
        actualReps: 10,
        actualWeightKg: 80,
        isCompleted: true,
      },
    ],
  });

  beforeEach(() => {
    mockSessionRepo = {
      save: vi.fn((session) => Promise.resolve({ ...session, id: 'session-saved-1' })),
      findByAthleteId: vi.fn(),
    };
    service = new WorkoutSessionService(mockSessionRepo);
  });

  // ─── logSession ─────────────────────────────────────────────────────────
  describe('logSession()', () => {
    it('CP-03-01: Registra una sesión completa con sets correctamente', async () => {
      const result = await service.logSession(baseDto());

      expect(result).toBeDefined();
      expect(mockSessionRepo.save).toHaveBeenCalled();
      expect(result.session).toBeDefined();
      expect(result.session.sets.length).toBe(1);
      expect(result.session.sets[0].actualWeightKg).toBe(80);
      expect(result.session.sets[0].actualReps).toBe(10);
    });

    it('CP-03-02: Rechaza si el peso es negativo', async () => {
      const dto = { ...baseDto(), sets: [{ ...baseDto().sets[0], actualWeightKg: -5 }] };
      await expect(service.logSession(dto)).rejects.toThrow(BadRequestException);
    });

    it('CP-03-03: Detecta un PR cuando el peso del set supera el máximo histórico del atleta', async () => {
      const dto = {
        ...baseDto(),
        sets: [
          { exerciseId: 'ex-bench', exerciseName: 'Press Banca', setNumber: 1, actualReps: 5, actualWeightKg: 120, isCompleted: true },
        ],
      };

      mockSessionRepo.findByAthleteId.mockResolvedValue([
        new WorkoutSession(
          'prev-sess',
          'athlete-1',
          'plan-1',
          'routine-1',
          'Día 1: Piernas',
          new Date('2026-10-01'),
          true,
          [new LoggedSet('s-prev', 'ex-bench', 'Press Banca', 1, 5, 110, true)],
        ),
      ]);

      const result = await service.logSession(dto);
      // El PR detectado (personalRecords) debe estar presente
      expect(result.personalRecords).toBeDefined();
      expect(result.personalRecords.length).toBeGreaterThan(0);
      expect(result.personalRecords[0].exerciseId).toBe('ex-bench');
      expect(result.personalRecords[0].newRecord).toBe(120);
    });

    it('CP-03-04: Acepta una sesión con RPE válido (1–10)', async () => {
      for (const rpe of [1, 5, 10]) {
        const dto = { ...baseDto(), rpe };
        const result = await service.logSession(dto);
        expect(result.session.rpe).toBe(rpe);
      }
    });

    it('CP-03-05: Permite registrar múltiples sets del mismo ejercicio', async () => {
      const dto = {
        ...baseDto(),
        sets: [
          { exerciseId: 'ex-s', exerciseName: 'Squat', setNumber: 1, actualReps: 8, actualWeightKg: 100, isCompleted: true },
          { exerciseId: 'ex-s', exerciseName: 'Squat', setNumber: 2, actualReps: 8, actualWeightKg: 100, isCompleted: true },
          { exerciseId: 'ex-s', exerciseName: 'Squat', setNumber: 3, actualReps: 6, actualWeightKg: 105, isCompleted: true },
        ],
      };
      const result = await service.logSession(dto);
      expect(result.session.sets.length).toBe(3);
    });

    it('CP-03-06: Registra sesión marcada como incompleta (completed = false)', async () => {
      const dto = { ...baseDto(), completed: false };
      const result = await service.logSession(dto);
      expect(result.session.completed).toBe(false);
    });
  });
});
