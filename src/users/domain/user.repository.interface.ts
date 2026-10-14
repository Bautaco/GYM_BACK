import { User } from './user.entity.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
  findByTrainerId(trainerId: string): Promise<User[]>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

export const USER_REPOSITORY_TOKEN = 'IUserRepository';
