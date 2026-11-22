import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepo: any;

  const makeAthlete = (id: string, fullName: string, trainerId: string) => ({
    id,
    email: `${id}@gym.com`,
    passwordHash: 'hash',
    fullName,
    role: UserRole.ATLETA,
    phone: '123456',
    notes: 'Nota',
    avatarUrl: 'https://avatar.url',
    trainerId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    mockUserRepo = {
      findByRole: vi.fn(),
      findByTrainerId: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn((u) => Promise.resolve({ ...u, id: u.id || 'user-new' })),
      delete: vi.fn(),
    };
    service = new UsersService(mockUserRepo);
  });

  it('getAthletes(): Retorna todos los atletas del sistema', async () => {
    mockUserRepo.findByRole.mockResolvedValue([
      makeAthlete('ath-1', 'Lucas Gómez', 'trainer-1'),
      makeAthlete('ath-2', 'Marcos Paz', 'trainer-1'),
      makeAthlete('ath-3', 'prueba de atleta', 'trainer-2'),
    ]);

    const result = await service.getAthletes();
    expect(result).toHaveLength(3);
    expect(mockUserRepo.findByRole).toHaveBeenCalledWith(UserRole.ATLETA);
  });

  it('getAthletesByTrainer(): Retorna únicamente los atletas asignados a dicho entrenador', async () => {
    mockUserRepo.findByTrainerId.mockResolvedValue([
      makeAthlete('ath-1', 'Lucas Gómez', 'trainer-1'),
      makeAthlete('ath-2', 'Marcos Paz', 'trainer-1'),
    ]);

    const result = await service.getAthletesByTrainer('trainer-1');
    expect(result).toHaveLength(2);
    expect(result.map((a) => a.fullName)).toEqual(['Lucas Gómez', 'Marcos Paz']);
    expect(mockUserRepo.findByTrainerId).toHaveBeenCalledWith('trainer-1');
  });

  it('createUserByAdmin(): Rechaza crear un ATLETA sin entrenador asignado', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      service.createUserByAdmin({
        email: 'nuevo@gym.com',
        password: 'password123',
        fullName: 'Atleta Nuevo',
        role: UserRole.ATLETA,
        trainerId: '',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('createUserByAdmin(): Permite crear un ATLETA cuando tiene un entrenador válido', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.findById.mockResolvedValue({
      id: 'trainer-1',
      role: UserRole.ENTRENADOR,
      fullName: 'Carlos Mendoza',
    });

    const result = await service.createUserByAdmin({
      email: 'nuevo@gym.com',
      password: 'password123',
      fullName: 'Atleta Nuevo',
      role: UserRole.ATLETA,
      trainerId: 'trainer-1',
    });

    expect(result.trainerId).toBe('trainer-1');
    expect(mockUserRepo.save).toHaveBeenCalled();
  });

  it('assignTrainer(): Rechaza dejar a un ATLETA sin entrenador asignado (null o vacío)', async () => {
    mockUserRepo.findById.mockResolvedValue(makeAthlete('ath-1', 'Lucas Gómez', 'trainer-1'));

    await expect(service.assignTrainer('ath-1', null)).rejects.toThrow(BadRequestException);
    await expect(service.assignTrainer('ath-1', '   ')).rejects.toThrow(BadRequestException);
  });

  it('assignTrainer(): Reasigna correctamente un atleta a otro entrenador válido', async () => {
    mockUserRepo.findById
      .mockResolvedValueOnce(makeAthlete('ath-1', 'Lucas Gómez', 'trainer-1'))
      .mockResolvedValueOnce({ id: 'trainer-2', role: UserRole.ENTRENADOR });

    const result = await service.assignTrainer('ath-1', 'trainer-2');
    expect(result.trainerId).toBe('trainer-2');
    expect(mockUserRepo.save).toHaveBeenCalled();
  });

  it('deleteUser(): Impide eliminar a un ENTRENADOR si todavía tiene atletas asignados', async () => {
    mockUserRepo.findById.mockResolvedValue({
      id: 'trainer-1',
      fullName: 'Prof. Carlos Mendoza',
      role: UserRole.ENTRENADOR,
    });
    mockUserRepo.findByTrainerId.mockResolvedValue([makeAthlete('ath-1', 'Lucas Gómez', 'trainer-1')]);

    await expect(service.deleteUser('trainer-1', 'admin-1')).rejects.toThrow(BadRequestException);
    expect(mockUserRepo.delete).not.toHaveBeenCalled();
  });
});
