import { UserRole } from '../../shared/decorators/roles.decorator.js';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public fullName: string,
    public role: UserRole,
    public createdAt: Date,
    public updatedAt: Date,
    public phone?: string,
    public notes?: string,
    public avatarUrl?: string,
    public trainerId?: string,
  ) {}

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isTrainer(): boolean {
    return this.role === UserRole.ENTRENADOR;
  }

  isAthlete(): boolean {
    return this.role === UserRole.ATLETA;
  }
}
