import { describe, it, expect } from 'vitest';
import { WorkoutSession } from './workout-session.entity.js';
import { LoggedSet } from './logged-set.entity.js';

describe('WorkoutSession Aggregate & Domain Methods (Unit)', () => {
  const makeSet = (
    exerciseId: string,
    setNumber: number,
    reps: number,
    weight: number,
    isCompleted = true,
  ) =>
    new LoggedSet(
      `set-${exerciseId}-${setNumber}`,
      exerciseId,
      exerciseId,
      setNumber,
      reps,
      weight,
      isCompleted,
    );

  it('totalVolume: calcula correctamente el tonelaje total de series completadas', () => {
    const sets = [
      makeSet('bench', 1, 10, 100, true), // 1000 kg
      makeSet('bench', 2, 8, 100, true),  // 800 kg
      makeSet('squat', 1, 5, 120, true),  // 600 kg
      makeSet('squat', 2, 3, 140, false), // no completada: 0
    ];

    const session = new WorkoutSession(
      'sess-1',
      'ath-1',
      'plan-1',
      'rout-1',
      'Día A',
      new Date(),
      true,
      sets,
    );

    expect(session.totalVolume()).toBe(2400);
  });

  it('maxWeightForExercise: obtiene la carga máxima completada para un ejercicio específico', () => {
    const sets = [
      makeSet('bench', 1, 10, 80),
      makeSet('bench', 2, 6, 95),
      makeSet('bench', 3, 3, 100),
      makeSet('squat', 1, 5, 120),
    ];

    const session = new WorkoutSession(
      'sess-1',
      'ath-1',
      'plan-1',
      'rout-1',
      'Día A',
      new Date(),
      true,
      sets,
    );

    expect(session.maxWeightForExercise('bench')).toBe(100);
    expect(session.maxWeightForExercise('squat')).toBe(120);
    expect(session.maxWeightForExercise('deadlift')).toBe(0);
  });

  it('max1RMForExercise: calcula 1RM estimado usando la fórmula de Epley', () => {
    // Epley: peso * (1 + reps / 30)
    // 100 kg x 10 reps -> 100 * (1 + 10/30) = 100 * 1.3333 = 133.3
    const sets = [
      makeSet('bench', 1, 10, 100),
    ];

    const session = new WorkoutSession(
      'sess-1',
      'ath-1',
      'plan-1',
      'rout-1',
      'Día A',
      new Date(),
      true,
      sets,
    );

    expect(session.max1RMForExercise('bench')).toBe(133.3);
  });

  it('max1RMForExercise: para 1 repetición retorna el peso directo como 1RM', () => {
    const sets = [
      makeSet('bench', 1, 1, 120),
    ];

    const session = new WorkoutSession(
      'sess-1',
      'ath-1',
      'plan-1',
      'rout-1',
      'Día A',
      new Date(),
      true,
      sets,
    );

    expect(session.max1RMForExercise('bench')).toBe(120);
  });

  it('max1RMForExercise: retorna 0 si no hay series completadas del ejercicio', () => {
    const sets = [
      makeSet('bench', 1, 5, 100, false),
    ];

    const session = new WorkoutSession(
      'sess-1',
      'ath-1',
      'plan-1',
      'rout-1',
      'Día A',
      new Date(),
      true,
      sets,
    );

    expect(session.max1RMForExercise('bench')).toBe(0);
  });

  it('instanciación con Value Objects: valida RPE y SessionDate correctamente', () => {
    const session = new WorkoutSession(
      'sess-1',
      'ath-1',
      'plan-1',
      'rout-1',
      'Día A',
      new Date('2026-05-10T10:00:00Z'),
      true,
      [],
      'Muy buena sesión',
      8,
      new Date(),
      60,
    );

    expect(session.rpeVo?.value).toBe(8);
    expect(session.duration?.minutes).toBe(60);
    expect(session.sessionDate.value.toISOString()).toBe('2026-05-10T10:00:00.000Z');
  });

  it('instanciación con RPE fuera de rango (1-10) arroja excepción de dominio', () => {
    expect(() => {
      new WorkoutSession(
        'sess-1',
        'ath-1',
        'plan-1',
        'rout-1',
        'Día A',
        new Date(),
        true,
        [],
        undefined,
        15, // inválido > 10
      );
    }).toThrow();
  });

  it('seriesRegistradas: mapea cada LoggedSet a su respectivo Value Object SerieRegistrada', () => {
    const sets = [
      makeSet('bench', 1, 8, 100),
      makeSet('bench', 2, 6, 100),
    ];

    const session = new WorkoutSession(
      'sess-1',
      'ath-1',
      'plan-1',
      'rout-1',
      'Día A',
      new Date(),
      true,
      sets,
    );

    const vos = session.seriesRegistradas;
    expect(vos).toHaveLength(2);
    expect(vos[0].actualReps).toBe(8);
    expect(vos[0].actualWeightKg).toBe(100);
  });
});
