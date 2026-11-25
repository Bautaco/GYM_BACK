import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { setupIntegrationApp, closeIntegrationApp, TestAppSetup } from './test-setup.js';

describe('Auth & Session Integration Tests (Supertest)', () => {
  let setup: TestAppSetup;

  beforeAll(async () => {
    setup = await setupIntegrationApp();
  });

  afterAll(async () => {
    await closeIntegrationApp();
  });

  it('1. POST /api/v1/auth/login con credenciales válidas retorna 200, JWT y datos de usuario', async () => {
    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@gym.com', password: 'admin123' })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toHaveProperty('email', 'admin@gym.com');
    expect(res.body.user).toHaveProperty('role', 'ADMIN');
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('2. POST /api/v1/auth/login con contraseña incorrecta retorna 401 Unauthorized', async () => {
    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@gym.com', password: 'wrongpassword' })
      .expect(401);

    expect(res.body.message).toContain('Credenciales');
  });

  it('3. POST /api/v1/auth/login con email inexistente retorna 401 Unauthorized', async () => {
    const res = await request(setup.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@gym.com', password: 'anypassword' })
      .expect(401);

    expect(res.body.message).toContain('Credenciales');
  });

  it('4. POST /api/v1/auth/login con cuerpo vacío retorna 400 Bad Request por validación', async () => {
    await request(setup.app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({})
      .expect(400);
  });

  it('5. GET /api/v1/auth/me sin token de autorización retorna 401 Unauthorized', async () => {
    await request(setup.app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401);
  });
});
