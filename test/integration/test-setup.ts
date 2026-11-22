import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';
import { AllExceptionsFilter } from '../../src/shared/filters/http-exception.filter.js';

export interface TestAppSetup {
  app: INestApplication;
  adminToken: string;
  trainerToken: string;
  athleteToken: string;
  athleteId: string;
}

let cachedSetup: TestAppSetup | null = null;

export async function setupIntegrationApp(): Promise<TestAppSetup> {
  if (cachedSetup) {
    return cachedSetup;
  }

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.init();

  // Login as admin
  const adminRes = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email: 'admin@gym.com', password: 'admin123' });

  // Login as trainer
  const trainerRes = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email: 'entrenador@gym.com', password: 'admin123' });

  // Login as athlete
  const athleteRes = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email: 'atleta@gym.com', password: 'atleta123' });

  cachedSetup = {
    app,
    adminToken: adminRes.body.accessToken,
    trainerToken: trainerRes.body.accessToken,
    athleteToken: athleteRes.body.accessToken,
    athleteId: athleteRes.body.user?.id,
  };

  return cachedSetup;
}

export async function closeIntegrationApp() {
  if (cachedSetup) {
    await cachedSetup.app.close();
    cachedSetup = null;
  }
}
