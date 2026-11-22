import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { setupIntegrationApp, closeIntegrationApp, TestAppSetup } from './test-setup.js';

describe('Users & Admin RBAC Integration Tests (Supertest)', () => {
  let setup: TestAppSetup;
  let createdUserId: string;

  beforeAll(async () => {
    setup = await setupIntegrationApp();
  });

  afterAll(async () => {
    await closeIntegrationApp();
  });

  it('1. GET /api/v1/users/admin/all con token ADMIN retorna 200 y array de usuarios', async () => {
    const res = await request(setup.app.getHttpServer())
      .get('/api/v1/users/admin/all')
      .set('Authorization', `Bearer ${setup.adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  it('2. GET /api/v1/users/admin/all con token ATLETA es bloqueado con 403 Forbidden', async () => {
    await request(setup.app.getHttpServer())
      .get('/api/v1/users/admin/all')
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .expect(403);
  });

  it('3. POST /api/v1/users/admin/create permite al ADMIN registrar un nuevo entrenador con 201', async () => {
    const uniqueEmail = `integration.trainer.${Date.now()}@gym.com`;
    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/users/admin/create')
      .set('Authorization', `Bearer ${setup.adminToken}`)
      .send({
        email: uniqueEmail,
        password: 'password123',
        fullName: 'Profesor Integración',
        role: 'ENTRENADOR',
        phone: '+54 9 11 9988-7766',
        notes: 'Creado en test de integración',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(uniqueEmail);
    expect(res.body.role).toBe('ENTRENADOR');
    createdUserId = res.body.id;
  });

  it('4. POST /api/v1/users/admin/create rechaza correo duplicado con 409 Conflict', async () => {
    await request(setup.app.getHttpServer())
      .post('/api/v1/users/admin/create')
      .set('Authorization', `Bearer ${setup.adminToken}`)
      .send({
        email: 'admin@gym.com',
        password: 'password123',
        fullName: 'Duplicate Admin',
        role: 'ADMIN',
      })
      .expect(409);
  });

  it('5. PATCH /api/v1/users/me permite actualizar perfil propio con 200', async () => {
    const res = await request(setup.app.getHttpServer())
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${setup.athleteToken}`)
      .send({
        phone: '+54 9 11 3344-5566',
        notes: 'Notas de perfil actualizadas en test',
      })
      .expect(200);

    expect(res.body.phone).toBe('+54 9 11 3344-5566');
    expect(res.body.notes).toBe('Notas de perfil actualizadas en test');
  });

  it('6. DELETE /api/v1/users/admin/:id permite al ADMIN dar de baja al usuario creado con 200', async () => {
    expect(createdUserId).toBeDefined();

    const res = await request(setup.app.getHttpServer())
      .delete(`/api/v1/users/admin/${createdUserId}`)
      .set('Authorization', `Bearer ${setup.adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });
});
