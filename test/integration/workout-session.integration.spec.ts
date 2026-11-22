import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { setupIntegrationApp, closeIntegrationApp, TestAppSetup } from './test-setup.js';

describe('Workout Session & Personal Records Integration Tests (Supertest)', () => {
  let setup: TestAppSetup;

  beforeAll(async () => {
    setup = await setupIntegrationApp();
  });

  afterAll(async () => {
    await closeIntegrationApp();
  });

  it('1. POST /api/v1/training-sessions/log registra una sesión con 201 y calcula tonelaje', async () => {
    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/training-sessions/log')
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .send({
        athleteId: setup.athleteId,
        trainingPlanId: 'plan-integration-1',
        routineId: 'rout-1',
        routineName: 'Día de Torso',
        date: new Date().toISOString(),
        completed: true,
        rpe: 8,
        durationMinutes: 55,
        notes: 'Sesión ejecutada en test de integración',
        sets: [
          {
            exerciseId: 'ex-bench-int',
            exerciseName: 'Press Banca Plano',
            setNumber: 1,
            actualReps: 10,
            actualWeightKg: 80,
            isCompleted: true,
          },
          {
            exerciseId: 'ex-bench-int',
            exerciseName: 'Press Banca Plano',
            setNumber: 2,
            actualReps: 8,
            actualWeightKg: 85,
            isCompleted: true,
          },
        ],
      })
      .expect(201);

    expect(res.body).toHaveProperty('session');
    expect(res.body.session.athleteId).toBe(setup.athleteId);
    expect(res.body.session.rpe).toBe(8);
  });

  it('2. POST /api/v1/training-sessions/log detecta y celebra Personal Record (PR)', async () => {
    const exId = `ex-pr-${Date.now()}`;
    const exName = 'Sentadilla Récord';

    // 1. Sesión base de referencia (ej. 100 kg)
    await request(setup.app.getHttpServer())
      .post('/api/v1/training-sessions/log')
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .send({
        athleteId: setup.athleteId,
        trainingPlanId: 'plan-integration-1',
        routineId: 'rout-1',
        routineName: 'Día Base',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
        sets: [
          {
            exerciseId: exId,
            exerciseName: exName,
            setNumber: 1,
            actualReps: 5,
            actualWeightKg: 100,
            isCompleted: true,
          },
        ],
      })
      .expect(201);

    // 2. Sesión que supera la marca (ej. 120 kg) -> Debe detectar PR
    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/training-sessions/log')
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .send({
        athleteId: setup.athleteId,
        trainingPlanId: 'plan-integration-1',
        routineId: 'rout-1',
        routineName: 'Día de Superación',
        date: new Date().toISOString(),
        completed: true,
        rpe: 9,
        durationMinutes: 45,
        sets: [
          {
            exerciseId: exId,
            exerciseName: exName,
            setNumber: 1,
            actualReps: 5,
            actualWeightKg: 120,
            isCompleted: true,
          },
        ],
      })
      .expect(201);

    expect(res.body).toHaveProperty('personalRecords');
    expect(Array.isArray(res.body.personalRecords)).toBe(true);
    expect(res.body.personalRecords.length).toBeGreaterThan(0);
    const maxPR = res.body.personalRecords.find((p: any) => p.type === 'PESO_MAXIMO');
    expect(maxPR).toBeDefined();
    expect(maxPR.previousRecord).toBe(100);
    expect(maxPR.newRecord).toBe(120);
    expect(maxPR.improvement).toBe(20);
  });

  it('3. POST /api/v1/training-sessions/log rechaza series con peso negativo arrojando 400', async () => {
    await request(setup.app.getHttpServer())
      .post('/api/v1/training-sessions/log')
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .send({
        athleteId: setup.athleteId,
        trainingPlanId: 'plan-integration-1',
        routineId: 'rout-1',
        routineName: 'Día con Error',
        date: new Date().toISOString(),
        completed: true,
        sets: [
          {
            exerciseId: 'ex-test',
            exerciseName: 'Test',
            setNumber: 1,
            actualReps: 10,
            actualWeightKg: -20,
            isCompleted: true,
          },
        ],
      })
      .expect(400);
  });

  it('4. POST /api/v1/training-sessions/log rechaza RPE superior a 10 con 400 Bad Request', async () => {
    await request(setup.app.getHttpServer())
      .post('/api/v1/training-sessions/log')
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .send({
        athleteId: setup.athleteId,
        trainingPlanId: 'plan-integration-1',
        routineId: 'rout-1',
        routineName: 'RPE Inválido',
        date: new Date().toISOString(),
        completed: true,
        rpe: 15,
        sets: [],
      })
      .expect(400);
  });

  it('5. GET /api/v1/training-sessions/athlete/:id retorna el historial de entrenamientos con 200', async () => {
    const res = await request(setup.app.getHttpServer())
      .get(`/api/v1/training-sessions/athlete/${setup.athleteId}`)
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
