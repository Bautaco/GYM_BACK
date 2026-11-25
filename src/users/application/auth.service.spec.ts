import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { User } from '../domain/user.entity.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

describe('AuthService (Unit)', () => {
  let authService: AuthService;
  let mockUserRepo: any;
  let mockJwtService: any;

  const mockUser = new User(
    'usr-1',
    'coach@gym.com',
    '$2a$10$hashedpass',
    'Coach Robert',
    UserRole.ENTRENADOR,
    new Date('2026-01-01'),
    new Date('2026-01-01'),
    '+54 9 11 1234-5678',
    'Notas del coach',
    'https://avatar.url',
  );

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: vi.fn(),
      save: vi.fn(),
      count: vi.fn(),
    };
    mockJwtService = {
      sign: vi.fn().mockReturnValue('mocked-jwt-token'),
    };
    authService = new AuthService(mockUserRepo, mockJwtService);
  });

  it('validateUser: retorna el usuario si el email y contraseña coinciden', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
    vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    const result = await authService.validateUser('coach@gym.com', 'correctpass');
    expect(result).toBe(mockUser);
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('coach@gym.com');
  });

  it('validateUser: lanza UnauthorizedException si el usuario no existe', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(authService.validateUser('unknown@gym.com', 'anypass'))
      .rejects.toThrow(UnauthorizedException);
  });

  it('validateUser: lanza UnauthorizedException si la contraseña no coincide', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
    vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

    await expect(authService.validateUser('coach@gym.com', 'wrongpass'))
      .rejects.toThrow(UnauthorizedException);
  });

  it('login: genera accessToken y retorna datos sanitizados del usuario', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
    vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    const response = await authService.login({
      email: 'coach@gym.com',
      password: 'correctpass',
    });

    expect(response.accessToken).toBe('mocked-jwt-token');
    expect(response.user.id).toBe('usr-1');
    expect(response.user.email).toBe('coach@gym.com');
    expect(response.user.role).toBe(UserRole.ENTRENADOR);
    expect((response.user as any).passwordHash).toBeUndefined();
  });

  it('register: crea y guarda un nuevo usuario con hash de contraseña', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.save.mockImplementation((u: User) => Promise.resolve({ ...u, id: 'usr-new' }));
    vi.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('salt' as any));
    vi.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('new-hash' as any));

    const res = await authService.register({
      email: 'newuser@gym.com',
      password: 'password123',
      fullName: 'New Athlete',
      role: UserRole.ATLETA,
      phone: '+54911223344',
      notes: 'Nota inicial',
    });

    expect(res.accessToken).toBe('mocked-jwt-token');
    expect(res.user.email).toBe('newuser@gym.com');
    expect(mockUserRepo.save).toHaveBeenCalled();
  });

  it('register: lanza ConflictException si el email ya se encuentra registrado', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);

    await expect(
      authService.register({
        email: 'coach@gym.com',
        password: 'pass',
        fullName: 'Duplicate',
        role: UserRole.ATLETA,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('register: normaliza correos a minúsculas y elimina espacios extras', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    let capturedUser: User | null = null;
    mockUserRepo.save.mockImplementation((u: User) => {
      capturedUser = u;
      return Promise.resolve({ ...u, id: 'usr-trimmed' });
    });

    await authService.register({
      email: '  ATHLETE@GYM.COM  ',
      password: 'password123',
      fullName: '  Trimmed Name  ',
      role: UserRole.ATLETA,
    });

    expect(capturedUser).not.toBeNull();
    expect(capturedUser!.email).toBe('athlete@gym.com');
    expect(capturedUser!.fullName).toBe('Trimmed Name');
  });

  it('login: genera JWT payload incluyendo sub, email, role y fullName', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
    vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    await authService.login({ email: 'coach@gym.com', password: 'correctpass' });

    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: 'usr-1',
      email: 'coach@gym.com',
      role: UserRole.ENTRENADOR,
      fullName: 'Coach Robert',
    });
  });
});
