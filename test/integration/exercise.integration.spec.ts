import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { setupIntegrationApp, closeIntegrationApp, TestAppSetup } from './test-setup.js';

describe('Exercise Catalog & Multimedia Integration Tests (Supertest)', () => {
  let setup: TestAppSetup;
  let createdExerciseId: string;

  beforeAll(async () => {
    setup = await setupIntegrationApp();
  });

  afterAll(async () => {
    await closeIntegrationApp();
  });

  it('1. GET /api/v1/exercises retorna 200 y listado de ejercicios con token', async () => {
    const res = await request(setup.app.getHttpServer())
      .get('/api/v1/exercises')
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('2. GET /api/v1/exercises/muscle-groups retorna lista de grupos musculares con 200', async () => {
    const res = await request(setup.app.getHttpServer())
      .get('/api/v1/exercises/muscle-groups')
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('Piernas');
    expect(res.body).toContain('Pecho');
  });

  it('3. GET /api/v1/exercises/target-zones retorna lista de zonas corporales con 200', async () => {
    const res = await request(setup.app.getHttpServer())
      .get('/api/v1/exercises/target-zones')
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('4. POST /api/v1/exercises crea un ejercicio con video para rol ENTRENADOR con 201', async () => {
    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/exercises')
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .send({
        nombre: `Prensa Inclinada ${Date.now()}`,
        grupoMuscularPrincipal: 'Piernas',
        zonasTrabajadas: ['Cuádriceps', 'Glúteos'],
        descripcion: 'Ejercicio compuesto de empuje para tren inferior.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.videoUrl).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    createdExerciseId = res.body.id;
  });

  it('5. PATCH /api/v1/exercises/:id permite desvincular el video asignando videoUrl a null con 200', async () => {
    expect(createdExerciseId).toBeDefined();

    const res = await request(setup.app.getHttpServer())
      .patch(`/api/v1/exercises/${createdExerciseId}`)
      .set('Authorization', `Bearer ${setup.trainerToken}`)
      .send({
        videoUrl: null,
      })
      .expect(200);

    expect(res.body.videoUrl).toBeNull();
  });
});
