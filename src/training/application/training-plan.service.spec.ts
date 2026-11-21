import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrainingPlanService } from './training-plan.service.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../shared/decorators/roles.decorator.js';

describe('TrainingPlanService (HU-01, HU-02)', () => {
  let service: TrainingPlanService;
  let mockPlanRepo: any;
  let mockUserRepo: any;

  const makeAthleteUser = (id = 'athlete-1') => ({
    id,
    fullName: 'Lucas Gómez',
    role: UserRole.ATLETA,
  });

  const makeValidDto = (overrides: Record<string, any> = {}) => ({
    name: 'Plan Hipertrofia 4 Semanas',
    athleteId: 'athlete-1',
    startDate: '2026-10-15',
    endDate: '2026-11-12',
    frequencyPerWeek: 1,
    sessionsPerDay: 1,
    routines: [
      {
        name: 'Día 1: Piernas',
        dayOfWeek: 1,
        exerciseItems: [
          { exerciseId: 'ex-1', exerciseName: 'Sentadilla', targetSets: 4, targetReps: 8, targetWeightKg: 80 },
        ],
      },
    ],
    ...overrides,
  });

  beforeEach(() => {
    mockPlanRepo = {
      findActiveByAthleteId: vi.fn().mockResolvedValue(null),
      findAllByAthleteId: vi.fn().mockResolvedValue([]),
      findById: vi.fn(),
      save: vi.fn((plan) => Promise.resolve({ ...plan, id: plan.id || 'plan-new' })),
      deactivatePreviousPlans: vi.fn().mockResolvedValue(undefined),
    };

    mockUserRepo = {
      findById: vi.fn().mockImplementation((id: string) =>
        id === 'athlete-1' ? Promise.resolve(makeAthleteUser(id)) : Promise.resolve(null),
      ),
    };

    service = new TrainingPlanService(mockPlanRepo, mockUserRepo);
  });

  // ─── createPlan ───────────────────────────────────────────────────────
  describe('createPlan()', () => {
    it('CP-01-01: Crea un plan válido con atleta existente', async () => {
      const result = await service.createPlan(makeValidDto(), 'trainer-1', 'Coach Rodrigo');

      expect(result).toBeDefined();
      expect(result.name).toBe('Plan Hipertrofia 4 Semanas');
      expect(result.isActive).toBe(true);
      expect(mockPlanRepo.deactivatePreviousPlans).toHaveBeenCalledWith('athlete-1');
      expect(mockPlanRepo.save).toHaveBeenCalled();
    });

    it('CP-01-02: Lanza NotFoundException si el atleta no existe', async () => {
      await expect(
        service.createPlan(makeValidDto({ athleteId: 'unknown-id' }), 'trainer-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('CP-01-03: Lanza BadRequestException si endDate < startDate', async () => {
      await expect(
        service.createPlan(makeValidDto({ startDate: '2026-11-15', endDate: '2026-10-12' }), 'trainer-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('CP-01-04: Lanza BadRequestException si las fechas se superponen con un plan activo/programado', async () => {
      mockPlanRepo.findAllByAthleteId.mockResolvedValue([
        {
          id: 'plan-exist',
          athleteId: 'athlete-1',
          name: 'Plan Activo',
          startDate: new Date('2026-10-15'),
          endDate: new Date('2026-11-15'),
          isActive: true,
        },
      ]);

      await expect(
        service.createPlan(makeValidDto({ startDate: '2026-11-01', endDate: '2026-11-30' }), 'trainer-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('CP-01-05: Desactiva los planes anteriores del atleta antes de crear el nuevo', async () => {
      await service.createPlan(makeValidDto(), 'trainer-1');
      expect(mockPlanRepo.deactivatePreviousPlans).toHaveBeenCalledWith('athlete-1');
    });

    it('CP-01-06: Permite plan con startDate = endDate (sesión de un día)', async () => {
      const dto = makeValidDto({ startDate: '2026-10-15', endDate: '2026-10-15' });
      const result = await service.createPlan(dto, 'trainer-1');
      expect(result).toBeDefined();
    });

    it('CP-01-07: Lanza BadRequestException si la cantidad de rutinas no coincide con frecuencia x sesiones', async () => {
      const dto = makeValidDto({
        frequencyPerWeek: 3,
        sessionsPerDay: 1,
        routines: [
          {
            name: 'Día 1: Piernas',
            dayOfWeek: 1,
            exerciseItems: [],
          },
        ],
      });

      await expect(service.createPlan(dto, 'trainer-1')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── getActivePlanByAthlete ───────────────────────────────────────────
  describe('getActivePlanByAthlete()', () => {
    it('CP-02-01: Devuelve el plan activo del atleta', async () => {
      mockPlanRepo.findActiveByAthleteId.mockResolvedValue({
        id: 'plan-active-1',
        athleteId: 'athlete-1',
        name: 'Plan Activo',
        isActive: true,
        routines: [],
      });

      const activePlan = await service.getActivePlanByAthlete('athlete-1');
      expect(activePlan).toBeDefined();
      expect(activePlan?.id).toBe('plan-active-1');
    });

    it('CP-02-02: Devuelve null si el atleta no tiene plan activo', async () => {
      mockPlanRepo.findActiveByAthleteId.mockResolvedValue(null);
      const result = await service.getActivePlanByAthlete('athlete-without-plan');
      expect(result).toBeNull();
    });
  });
});
