import { describe, it, expect, vi, beforeEach } from 'vitest';
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
      findAll: vi.fn(),
      save: vi.fn(),
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
});
