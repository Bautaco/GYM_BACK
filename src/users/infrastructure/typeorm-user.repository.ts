import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity.js';
import { IUserRepository } from '../domain/user.repository.interface.js';
import { UserOrmEntity } from './user.orm-entity.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  private toDomain(orm: UserOrmEntity): User {
    return new User(
      orm.id,
      orm.email,
      orm.passwordHash,
      orm.fullName,
      orm.role,
      orm.createdAt,
      orm.updatedAt,
      orm.phone,
      orm.notes,
      orm.avatarUrl,
      orm.trainerId,
    );
  }

  private toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.email = domain.email;
    orm.passwordHash = domain.passwordHash;
    orm.fullName = domain.fullName;
    orm.role = domain.role;
    orm.phone = domain.phone;
    orm.notes = domain.notes;
    orm.avatarUrl = domain.avatarUrl;
    orm.trainerId = domain.trainerId;
    return orm;
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    return found ? this.toDomain(found) : null;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const found = await this.repo.find({
      where: { role },
      order: { fullName: 'ASC' },
    });
    return found.map((u) => this.toDomain(u));
  }

  async findByTrainerId(trainerId: string): Promise<User[]> {
    const found = await this.repo.find({
      where: { trainerId },
      order: { fullName: 'ASC' },
    });
    return found.map((u) => this.toDomain(u));
  }

  async findAll(): Promise<User[]> {
    const found = await this.repo.find({
      order: { role: 'ASC', fullName: 'ASC' },
    });
    return found.map((u) => this.toDomain(u));
  }

  async save(user: User): Promise<User> {
    const orm = this.toOrm(user);
    const saved = await this.repo.save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }
}
