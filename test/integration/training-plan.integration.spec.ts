import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { setupIntegrationApp, closeIntegrationApp, TestAppSetup } from './test-setup.js';

describe('Training Plans & Overlap Validation Integration Tests (Supertest)', () => {
  let setup: TestAppSetup;
  let createdPlanId: string;
  let validStart: Date;
  let validEnd: Date;

  beforeAll(async () => {
    setup = await setupIntegrationApp();
  });

  afterAll(async () => {
    await closeIntegrationApp();
  });

  it('1. GET /api/v1/training-plans/athlete/:id retorna el plan activo del atleta', async () => {
    const res = await request(setup.app.getHttpServer())
      .get(`/api/v1/training-plans/athlete/${setup.athleteId}`)
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .expect(200);

    if (res.body) {
      expect(res.body).toHaveProperty('id');
      expect(res.body.athleteId).toBe(setup.athleteId);
    }
  });

  it('2. GET /api/v1/training-plans/athlete/:id/all retorna el historial de planes con 200', async () => {
    const res = await request(setup.app.getHttpServer())
      .get(`/api/v1/training-plans/athlete/${setup.athleteId}/all`)
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('3. POST /api/v1/training-plans crea un nuevo microciclo para el atleta con 201', async () => {
    // Obtener los planes existentes para encontrar una ventana libre sin solapamiento
    const allPlansRes = await request(setup.app.getHttpServer())
      .get(`/api/v1/training-plans/athlete/${setup.athleteId}/all`)
      .set('Authorization', `Bearer ${setup.trainerToken}`);

    let maxEndMs = Date.now();
    if (Array.isArray(allPlansRes.body)) {
      for (const p of allPlansRes.body) {
        const pEndMs = new Date(p.endDate).getTime();
        if (pEndMs > maxEndMs) maxEndMs = pEndMs;
      }
    }

    validStart = new Date(maxEndMs + 7 * 24 * 60 * 60 * 1000);
    validEnd = new Date(maxEndMs + 37 * 24 * 60 * 60 * 1000);

    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/training-plans')
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .send({
        name: 'Microciclo Integración Fuerza',
        athleteId: setup.athleteId,
        startDate: validStart.toISOString().split('T')[0],
        endDate: validEnd.toISOString().split('T')[0],
        frequencyPerWeek: 1,
        sessionsPerDay: 1,
        routines: [
          {
            name: 'Día 1 - Full Body',
            dayOfWeek: 1,
            exerciseItems: [
              {
                exerciseId: 'ex-bench',
                exerciseName: 'Press de Banca',
                targetSets: 4,
                targetReps: 10,
                targetWeightKg: 80,
                restSeconds: 90,
                cadence: '3-0-1-0',
              },
            ],
          },
        ],
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Microciclo Integración Fuerza');
    createdPlanId = res.body.id;
  });

  it('4. POST /api/v1/training-plans rechaza con 400 Bad Request si las fechas se solapan con un plan existente', async () => {
    // Solaparse exactamente con la ventana de fechas del plan recién creado en el test 3
    const overlapStart = new Date(validStart.getTime() + 3 * 24 * 60 * 60 * 1000);
    const overlapEnd = new Date(validEnd.getTime() + 10 * 24 * 60 * 60 * 1000);

    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/training-plans')
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .send({
        name: 'Plan Solapado Conflicto',
        athleteId: setup.athleteId,
        startDate: overlapStart.toISOString().split('T')[0],
        endDate: overlapEnd.toISOString().split('T')[0],
        frequencyPerWeek: 1,
        sessionsPerDay: 1,
        routines: [
          {
            name: 'Día 1 - Solapado',
            dayOfWeek: 1,
            exerciseItems: [],
          },
        ],
      })
      .expect(400);

    expect(res.body.message).toContain('rango de fechas');
  });

  it('5. PUT /api/v1/training-plans/:id permite actualizar la configuración de un plan existente con 200', async () => {
    expect(createdPlanId).toBeDefined();

    const res = await request(setup.app.getHttpServer())
      .put(`/api/v1/training-plans/${createdPlanId}`)
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .send({
        name: 'Microciclo Integración Actualizado',
        athleteId: setup.athleteId,
        startDate: validStart.toISOString().split('T')[0],
        endDate: validEnd.toISOString().split('T')[0],
        frequencyPerWeek: 1,
        sessionsPerDay: 1,
        routines: [
          {
            name: 'Día 1 - Rutina Actualizada',
            dayOfWeek: 1,
            exerciseItems: [],
          },
        ],
      })
      .expect(200);

    expect(res.body.name).toBe('Microciclo Integración Actualizado');
  });
});
