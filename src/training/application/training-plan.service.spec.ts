import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TrainingPlanService } from './training-plan.service.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../shared/decorators/roles.decorator.js';

describe('TrainingPlanService (HU-01, HU-02)', () => {
  let service: TrainingPlanService;
  let mockPlanRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    mockPlanRepo = {
      findActiveByAthleteId: vi.fn(),
      findAllByAthleteId: vi.fn(),
      findById: vi.fn(),
      save: vi.fn((plan) => Promise.resolve({ ...plan, id: 'plan-123' })),
      deactivatePreviousPlans: vi.fn().mockResolvedValue(undefined),
    };

    mockUserRepo = {
      findById: vi.fn().mockImplementation((id: string) => {
        if (id === 'athlete-1') {
          return Promise.resolve({
            id: 'athlete-1',
            fullName: 'Lucas Gómez',
            role: UserRole.ATLETA,
          });
        }
        return Promise.resolve(null);
      }),
    };

    service = new TrainingPlanService(mockPlanRepo, mockUserRepo);
  });

  it('CP-01-01 (Camino feliz): Crea un plan válido de 4 semanas para un atleta', async () => {
    const dto = {
      name: 'Plan Hipertrofia 4 Semanas',
      athleteId: 'athlete-1',
      startDate: '2026-10-15',
      endDate: '2026-11-12',
      routines: [
        {
          name: 'Día 1: Piernas',
          dayOfWeek: 1,
          exerciseItems: [
            {
              exerciseId: 'ex-1',
              exerciseName: 'Sentadilla Profunda',
              targetSets: 4,
              targetReps: 8,
              targetWeightKg: 80,
            },
          ],
        },
      ],
    };

    const result = await service.createPlan(dto, 'trainer-1', 'Coach Rodrigo');
    expect(result).toBeDefined();
    expect(mockPlanRepo.deactivatePreviousPlans).toHaveBeenCalledWith('athlete-1');
    expect(mockPlanRepo.save).toHaveBeenCalled();
    expect(result.name).toBe('Plan Hipertrofia 4 Semanas');
    expect(result.isActive).toBe(true);
  });

  it('CP-01-02 (Validación de atleta inexistente): Rechaza si el atleta no existe', async () => {
    const dto = {
      name: 'Plan Invalido',
      athleteId: 'non-existent-athlete',
      startDate: '2026-10-15',
      endDate: '2026-11-12',
      routines: [],
    };

    await expect(service.createPlan(dto, 'trainer-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('CP-01-02 (Validación de fechas): Rechaza si la fecha de fin es anterior a la de inicio', async () => {
    const dto = {
      name: 'Plan con fechas inválidas',
      athleteId: 'athlete-1',
      startDate: '2026-11-15',
      endDate: '2026-10-12',
      routines: [],
    };

    await expect(service.createPlan(dto, 'trainer-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('CP-02-01: Obtiene el plan activo asignado al atleta', async () => {
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

  it('CP-02-02: Devuelve null si el atleta no tiene planes activos', async () => {
    mockPlanRepo.findActiveByAthleteId.mockResolvedValue(null);

    const activePlan = await service.getActivePlanByAthlete('athlete-without-plan');
    expect(activePlan).toBeNull();
  });
});
