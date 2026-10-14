import { Repository } from 'typeorm';
import { User } from '../domain/user.entity.js';
import { IUserRepository } from '../domain/user.repository.interface.js';
import { UserOrmEntity } from './user.orm-entity.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';
export declare class TypeOrmUserRepository implements IUserRepository {
    private readonly repo;
    constructor(repo: Repository<UserOrmEntity>);
    private toDomain;
    private toOrm;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByRole(role: UserRole): Promise<User[]>;
    findByTrainerId(trainerId: string): Promise<User[]>;
    findAll(): Promise<User[]>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
