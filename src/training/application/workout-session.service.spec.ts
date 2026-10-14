import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkoutSessionService } from './workout-session.service.js';
import { BadRequestException } from '@nestjs/common';

describe('WorkoutSessionService (HU-03)', () => {
  let service: WorkoutSessionService;
  let mockSessionRepo: any;

  beforeEach(() => {
    mockSessionRepo = {
      save: vi.fn((session) => Promise.resolve({ ...session, id: 'session-saved-1' })),
      findByAthleteId: vi.fn(),
    };
    service = new WorkoutSessionService(mockSessionRepo);
  });

  it('CP-03-01 (Guardado exitoso de marcas): Registra las series ejecutadas correctamente', async () => {
    const dto = {
      athleteId: 'athlete-1',
      trainingPlanId: 'plan-1',
      routineId: 'routine-1',
      routineName: 'Día 1: Piernas',
      date: '2026-10-13',
      completed: true,
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
    };

    const result = await service.logSession(dto);
    expect(result).toBeDefined();
    expect(mockSessionRepo.save).toHaveBeenCalled();
    expect(result.session).toBeDefined();
    expect(result.session.sets.length).toBe(1);
    expect(result.session.sets[0].actualWeightKg).toBe(80);
    expect(result.session.sets[0].actualReps).toBe(10);
  });

  it('CP-03-02 (Validación de peso negativo): Rechaza el guardado si el peso es negativo', async () => {
    const dto = {
      athleteId: 'athlete-1',
      trainingPlanId: 'plan-1',
      routineId: 'routine-1',
      routineName: 'Día 1: Piernas',
      date: '2026-10-13',
      sets: [
        {
          exerciseId: 'ex-squat',
          exerciseName: 'Sentadilla Profunda',
          setNumber: 1,
          actualReps: 10,
          actualWeightKg: -5,
        },
      ],
    };

    await expect(service.logSession(dto)).rejects.toThrow(BadRequestException);
  });
});
