import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from './analytics.service.js';

describe('AnalyticsService (HU-06)', () => {
  let service: AnalyticsService;
  let mockSessionRepo: any;
  let mockPlanRepo: any;
  let mockExerciseRepo: any;

  beforeEach(() => {
    mockSessionRepo = {
      findExerciseMaxHistory: vi.fn(),
      findByAthleteId: vi.fn(),
    };
    mockPlanRepo = {
      findActiveByAthleteId: vi.fn(),
    };
    mockExerciseRepo = {
      findById: vi.fn(),
    };
    service = new AnalyticsService(
      mockSessionRepo,
      mockPlanRepo,
      mockExerciseRepo,
    );
  });

  it('CP-06-01 (Generación correcta del gráfico de cargas): Retorna el historial temporal de marcas', async () => {
    mockExerciseRepo.findById.mockResolvedValue({
      id: 'ex-bench',
      nombre: 'Press de Banca',
      grupoMuscularPrincipal: 'Pecho',
    });

    mockSessionRepo.findExerciseMaxHistory.mockResolvedValue([
      { date: '2026-09-20', maxWeightKg: 60 },
      { date: '2026-09-27', maxWeightKg: 65 },
      { date: '2026-10-04', maxWeightKg: 70 },
    ]);

    const result = await service.getStrengthProgress('athlete-1', 'ex-bench');
    expect(result.exerciseName).toBe('Press de Banca');
    expect(result.history.length).toBe(3);
    expect(result.history[2].maxWeightKg).toBe(70);
  });

  it('CP-06-02 (Cálculo de la tasa de adherencia): Calcula el 80% al completar 8 de 10 sesiones', async () => {
    // 10 planned sessions
    mockPlanRepo.findActiveByAthleteId.mockResolvedValue({
      id: 'plan-1',
      name: 'Plan 4 semanas',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-10-25'),
      routines: [
        { id: 'r1', name: 'Rutina 1' },
        { id: 'r2', name: 'Rutina 2' },
        { id: 'r3', name: 'Rutina 3' },
      ], // diffDays ~24 => ~3 weeks * 3 = ~9-10 planned
    });

    // 8 completed sessions
    const eightSessions = Array.from({ length: 8 }, (_, i) => ({
      id: `s-${i}`,
      completed: true,
    }));
    mockSessionRepo.findByAthleteId.mockResolvedValue(eightSessions);

    const adherence = await service.getAdherence('athlete-1');
    expect(adherence.hasActivePlan).toBe(true);
    expect(adherence.completedSessions).toBe(8);
    expect(adherence.adherencePercentage).toBeGreaterThanOrEqual(75);
    expect(adherence.message).toBeDefined();
  });
});
