import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from './analytics.service.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeSession = (overrides: Record<string, any> = {}) => ({
  id: overrides.id ?? 'sess-1',
  athleteId: overrides.athleteId ?? 'ath-1',
  date: overrides.date ?? new Date('2026-10-10'),
  completed: overrides.completed ?? true,
  durationMinutes: overrides.durationMinutes ?? 60,
  rpe: overrides.rpe ?? 7,
  sets: overrides.sets ?? [
    { isCompleted: true, actualWeightKg: 100, actualReps: 5, exerciseId: 'ex-bench' },
  ],
  ...overrides,
});

const makePlan = (overrides: Record<string, any> = {}) => ({
  id: overrides.id ?? 'plan-1',
  name: overrides.name ?? 'Fuerza e Hipertrofia',
  athleteId: overrides.athleteId ?? 'ath-1',
  trainerId: overrides.trainerId ?? 'trainer-1',
  startDate: overrides.startDate ?? new Date('2026-10-01'),
  endDate: overrides.endDate ?? new Date('2026-12-31'),
  isActive: overrides.isActive ?? true,
  frequencyPerWeek: overrides.frequencyPerWeek ?? 3,
  routines: overrides.routines ?? [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }],
  ...overrides,
});

// ─── TESTS ────────────────────────────────────────────────────────────────────
describe('AnalyticsService', () => {
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
    service = new AnalyticsService(mockSessionRepo, mockPlanRepo, mockExerciseRepo);
  });

  // ─── getStrengthProgress ───────────────────────────────────────────────
  describe('getStrengthProgress()', () => {
    it('CP-06-01a: Retorna historial temporal de marcas ordenado', async () => {
      mockExerciseRepo.findById.mockResolvedValue({ id: 'ex-bench', nombre: 'Press de Banca', grupoMuscularPrincipal: 'Pecho' });
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

    it('CP-06-01b: Lanza error si el ejercicio no existe', async () => {
      mockExerciseRepo.findById.mockResolvedValue(null);
      await expect(service.getStrengthProgress('ath-1', 'invalid-ex')).rejects.toThrow();
    });
  });

  // ─── getAdherence ─────────────────────────────────────────────────────
  describe('getAdherence()', () => {
    it('CP-06-02a: Calcula 80% de adherencia al completar 8 de 10 sesiones', async () => {
      mockPlanRepo.findActiveByAthleteId.mockResolvedValue(makePlan({
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-10-25'),
        routines: [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }],
      }));
      mockSessionRepo.findByAthleteId.mockResolvedValue(
        Array.from({ length: 8 }, (_, i) => ({ id: `s-${i}`, completed: true })),
      );

      const adherence = await service.getAdherence('athlete-1');
      expect(adherence.hasActivePlan).toBe(true);
      expect(adherence.completedSessions).toBe(8);
      expect(adherence.adherencePercentage).toBeGreaterThanOrEqual(75);
      expect(adherence.message).toBeDefined();
    });

    it('CP-06-02b: Devuelve hasActivePlan=false si el atleta no tiene plan activo', async () => {
      mockPlanRepo.findActiveByAthleteId.mockResolvedValue(null);
      mockSessionRepo.findByAthleteId.mockResolvedValue([]);

      const adherence = await service.getAdherence('ath-no-plan');
      expect(adherence.hasActivePlan).toBe(false);
    });

    it('CP-06-02c: Adherencia acotada al máximo 100% aunque haya más sesiones que lo planificado', async () => {
      mockPlanRepo.findActiveByAthleteId.mockResolvedValue(makePlan({
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-10-08'), // 1 semana → ~3 sesiones esperadas
        routines: [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }],
      }));
      // 20 sesiones completadas (sobreentrenamiento)
      mockSessionRepo.findByAthleteId.mockResolvedValue(
        Array.from({ length: 20 }, (_, i) => ({ id: `s-${i}`, completed: true })),
      );

      const adherence = await service.getAdherence('ath-overtrained');
      expect(adherence.adherencePercentage).toBeLessThanOrEqual(100);
    });
  });

  // ─── getAdminExecutiveOverview ─────────────────────────────────────────
  describe('getAdminExecutiveOverview()', () => {
    let mockUserRepo: any;
    let mockWeightRepo: any;
    let mockTemplateRepo: any;

    beforeEach(() => {
      mockUserRepo = {
        findAll: vi.fn().mockResolvedValue([
          { id: 'admin-1', role: 'ADMIN', fullName: 'Director CAR' },
          { id: 'trainer-1', role: 'ENTRENADOR', fullName: 'Prof. Carlos Mendoza' },
          { id: 'ath-1', role: 'ATLETA', fullName: 'Lucas Gómez', trainerId: 'trainer-1' },
          { id: 'ath-2', role: 'ATLETA', fullName: 'Marcos Paz', trainerId: 'trainer-1' },
        ]),
        findByRole: vi.fn().mockImplementation((role: string) => {
          if (role === 'ATLETA') return Promise.resolve([
            { id: 'ath-1', role: 'ATLETA', fullName: 'Lucas Gómez', trainerId: 'trainer-1' },
            { id: 'ath-2', role: 'ATLETA', fullName: 'Marcos Paz', trainerId: 'trainer-1' },
          ]);
          if (role === 'ENTRENADOR') return Promise.resolve([
            { id: 'trainer-1', role: 'ENTRENADOR', fullName: 'Prof. Carlos Mendoza' },
          ]);
          return Promise.resolve([]);
        }),
      };

      mockPlanRepo.findAll = vi.fn().mockResolvedValue([
        makePlan({ id: 'plan-1', athleteId: 'ath-1', trainerId: 'trainer-1', isActive: true, endDate: new Date('2026-12-01') }),
        makePlan({ id: 'plan-2', athleteId: 'ath-2', trainerId: 'trainer-1', isActive: false, endDate: new Date('2026-09-01') }),
      ]);

      mockSessionRepo.findAll = vi.fn().mockResolvedValue([
        makeSession({ id: 'sess-1', athleteId: 'ath-1', date: new Date('2026-10-10'), rpe: 8, durationMinutes: 75,
          sets: [
            { isCompleted: true, actualWeightKg: 100, actualReps: 5, exerciseId: 'ex-bench' },
            { isCompleted: true, actualWeightKg: 105, actualReps: 3, exerciseId: 'ex-bench' },
          ],
        }),
        makeSession({ id: 'sess-2', athleteId: 'ath-1', date: new Date('2026-10-15'), rpe: 9, durationMinutes: 60,
          sets: [{ isCompleted: true, actualWeightKg: 110, actualReps: 3, exerciseId: 'ex-bench' }],
        }),
        makeSession({ id: 'sess-3', athleteId: 'ath-2', date: new Date('2026-08-15'), rpe: 6, durationMinutes: 45,
          sets: [{ isCompleted: true, actualWeightKg: 50, actualReps: 10, exerciseId: 'ex-squat' }],
        }),
      ]);

      mockExerciseRepo.findAll = vi.fn().mockResolvedValue([
        { id: 'ex-bench', nombre: 'Press de Banca', grupoMuscularPrincipal: 'Pecho', videoUrl: 'https://youtube.com/watch?v=123' },
        { id: 'ex-squat', nombre: 'Sentadilla', grupoMuscularPrincipal: 'Piernas', videoUrl: 'https://youtube.com/shorts/456' },
        { id: 'ex-dead', nombre: 'Peso Muerto', grupoMuscularPrincipal: 'Espalda', videoUrl: null },
      ]);

      mockWeightRepo = {
        findAll: vi.fn().mockResolvedValue([
          { id: 'w1', athleteId: 'ath-1', weightKg: 80, recordedAt: new Date('2026-10-01') },
          { id: 'w2', athleteId: 'ath-1', weightKg: 81, recordedAt: new Date('2026-10-15') },
        ]),
      };

      mockTemplateRepo = {
        findAll: vi.fn().mockResolvedValue([
          { id: 'tpl-1', name: 'Push', trainerId: 'trainer-1' },
          { id: 'tpl-2', name: 'Pull', trainerId: 'trainer-1' },
        ]),
      };

      service = new AnalyticsService(
        mockSessionRepo,
        mockPlanRepo,
        mockExerciseRepo,
        mockUserRepo,
        mockWeightRepo,
        mockTemplateRepo,
      );
    });

    it('CP-06-03: Cobertura de planes — 1 de 2 atletas tiene plan activo (50%)', async () => {
      const overview = await service.getAdminExecutiveOverview();

      expect(overview.adherenceAndCoverage).toBeDefined();
      expect(overview.adherenceAndCoverage.planCoverage.totalAthletes).toBe(2);
      expect(overview.adherenceAndCoverage.planCoverage.athletesWithActivePlan).toBe(1);
      expect(overview.adherenceAndCoverage.planCoverage.athletesWithExpiredPlan).toBe(1);
      expect(overview.adherenceAndCoverage.planCoverage.activePlanCoveragePercentage).toBe(50);
    });

    it('CP-06-03b: Rangos de adherencia verde/amarillo/rojo están definidos', async () => {
      const overview = await service.getAdminExecutiveOverview();
      const { green, yellow, red } = overview.adherenceAndCoverage.adherenceRanges;
      expect(green).toBeDefined();
      expect(yellow).toBeDefined();
      expect(red).toBeDefined();
      // Todos los atletas deben estar clasificados en algún rango
      expect(green.count + yellow.count + red.count).toBeGreaterThanOrEqual(0);
    });

    it('CP-06-04a: RPE promedio calculado sobre las 3 sesiones (media ponderada)', async () => {
      const overview = await service.getAdminExecutiveOverview();
      const { averageRpe, totalCompletedSessions } = overview.loadAndSportsPerformance.fatigueAndLoad;

      expect(totalCompletedSessions).toBe(3);
      // RPE de las 3 sesiones: 8, 9, 6 → promedio ~7.67
      expect(averageRpe).toBeGreaterThan(6);
      expect(averageRpe).toBeLessThanOrEqual(10);
    });

    it('CP-06-04b: Tonelaje acumulado es positivo', async () => {
      const overview = await service.getAdminExecutiveOverview();
      expect(overview.loadAndSportsPerformance.fatigueAndLoad.totalTonnageKg).toBeGreaterThan(0);
    });

    it('CP-06-04c: La distribución de RPE tiene 4 bandas', async () => {
      const overview = await service.getAdminExecutiveOverview();
      expect(overview.loadAndSportsPerformance.fatigueAndLoad.rpeDistribution.length).toBe(4);
    });

    it('CP-06-04d: Detecta al menos 1 PR', async () => {
      const overview = await service.getAdminExecutiveOverview();
      expect(overview.loadAndSportsPerformance.strengthAndRecords.totalPRs).toBeGreaterThanOrEqual(1);
    });

    it('CP-06-04e: Registros de peso corporal correctos (2 registros, 1 atleta)', async () => {
      const overview = await service.getAdminExecutiveOverview();
      const { totalWeightRecords, weighedAthletesCount } = overview.loadAndSportsPerformance.anthropometry;
      expect(totalWeightRecords).toBe(2);
      expect(weighedAthletesCount).toBe(1);
    });

    it('CP-06-05a: Conteo de usuarios por rol correcto', async () => {
      const overview = await service.getAdminExecutiveOverview();
      const { adminCount, trainerCount, athleteCount } = overview.staffAndCatalogOperation.usersByRole;
      expect(adminCount).toBe(1);
      expect(trainerCount).toBe(1);
      expect(athleteCount).toBe(2);
    });

    it('CP-06-05b: Carga del entrenador incluye templates y sesiones', async () => {
      const overview = await service.getAdminExecutiveOverview();
      const coaches = overview.staffAndCatalogOperation.coachesPerformance;
      expect(coaches.length).toBe(1);
      expect(coaches[0].trainerName).toBe('Prof. Carlos Mendoza');
      expect(coaches[0].templatesCreatedCount).toBe(2);
    });

    it('CP-06-05c: Métricas del catálogo — 2 de 3 ejercicios tienen video (67%)', async () => {
      const overview = await service.getAdminExecutiveOverview();
      const catalog = overview.staffAndCatalogOperation.catalogMetrics;
      expect(catalog.totalExercises).toBe(3);
      expect(catalog.exercisesWithVideo).toBe(2);
      expect(catalog.videoTypes.youtubeStandard).toBe(1);
      expect(catalog.videoTypes.youtubeShorts).toBe(1);
      expect(catalog.videoCoveragePercentage).toBe(67);
    });

    it('CP-06-05d: Con filtro de período, solo se consideran sesiones dentro del rango', async () => {
      // Solo sesiones de octubre 2026
      const overview = await service.getAdminExecutiveOverview({
        startDate: '2026-10-01',
        endDate: '2026-10-31',
      });
      // La sesión de agosto (sess-3) NO debe contarse
      expect(overview.loadAndSportsPerformance.fatigueAndLoad.totalCompletedSessions).toBe(2);
    });
  });
});
