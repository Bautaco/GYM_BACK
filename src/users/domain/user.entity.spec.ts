import { describe, it, expect } from 'vitest';
import { User } from './user.entity.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';

describe('User Domain Entity (Unit)', () => {
  it('instancia correctamente un usuario con todas sus propiedades', () => {
    const now = new Date();
    const user = new User(
      'usr-100',
      'test@gym.com',
      'hash123',
      'Juan Pérez',
      UserRole.ADMIN,
      now,
      now,
      '+54 9 11 1111-2222',
      'Notas del administrador',
      'https://avatar.url',
    );

    expect(user.id).toBe('usr-100');
    expect(user.email).toBe('test@gym.com');
    expect(user.fullName).toBe('Juan Pérez');
    expect(user.role).toBe(UserRole.ADMIN);
  });

  it('isAdmin: retorna true únicamente para rol ADMIN', () => {
    const admin = new User('1', 'a@gym.com', 'h', 'Admin', UserRole.ADMIN, new Date(), new Date());
    const trainer = new User('2', 't@gym.com', 'h', 'Trainer', UserRole.ENTRENADOR, new Date(), new Date());
    const athlete = new User('3', 'ath@gym.com', 'h', 'Athlete', UserRole.ATLETA, new Date(), new Date());

    expect(admin.isAdmin()).toBe(true);
    expect(trainer.isAdmin()).toBe(false);
    expect(athlete.isAdmin()).toBe(false);
  });

  it('isTrainer: retorna true únicamente para rol ENTRENADOR', () => {
    const trainer = new User('2', 't@gym.com', 'h', 'Trainer', UserRole.ENTRENADOR, new Date(), new Date());
    const athlete = new User('3', 'ath@gym.com', 'h', 'Athlete', UserRole.ATLETA, new Date(), new Date());

    expect(trainer.isTrainer()).toBe(true);
    expect(athlete.isTrainer()).toBe(false);
  });

  it('isAthlete: retorna true únicamente para rol ATLETA', () => {
    const athlete = new User('3', 'ath@gym.com', 'h', 'Athlete', UserRole.ATLETA, new Date(), new Date());
    const admin = new User('1', 'a@gym.com', 'h', 'Admin', UserRole.ADMIN, new Date(), new Date());

    expect(athlete.isAthlete()).toBe(true);
    expect(admin.isAthlete()).toBe(false);
  });

  it('permite asociar un trainerId a un atleta', () => {
    const athlete = new User(
      'ath-1',
      'ath@gym.com',
      'h',
      'Alumno Con Coach',
      UserRole.ATLETA,
      new Date(),
      new Date(),
      undefined,
      undefined,
      undefined,
      'trainer-99',
    );

    expect(athlete.trainerId).toBe('trainer-99');
  });
});
