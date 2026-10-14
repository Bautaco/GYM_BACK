var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity.js';
import { UserOrmEntity } from './user.orm-entity.js';
let TypeOrmUserRepository = class TypeOrmUserRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    toDomain(orm) {
        return new User(orm.id, orm.email, orm.passwordHash, orm.fullName, orm.role, orm.createdAt, orm.updatedAt, orm.phone, orm.notes, orm.avatarUrl, orm.trainerId);
    }
    toOrm(domain) {
        const orm = new UserOrmEntity();
        if (domain.id)
            orm.id = domain.id;
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
    async findById(id) {
        const found = await this.repo.findOne({ where: { id } });
        return found ? this.toDomain(found) : null;
    }
    async findByEmail(email) {
        const found = await this.repo.findOne({
            where: { email: email.toLowerCase().trim() },
        });
        return found ? this.toDomain(found) : null;
    }
    async findByRole(role) {
        const found = await this.repo.find({
            where: { role },
            order: { fullName: 'ASC' },
        });
        return found.map((u) => this.toDomain(u));
    }
    async findByTrainerId(trainerId) {
        const found = await this.repo.find({
            where: { trainerId },
            order: { fullName: 'ASC' },
        });
        return found.map((u) => this.toDomain(u));
    }
    async findAll() {
        const found = await this.repo.find({
            order: { role: 'ASC', fullName: 'ASC' },
        });
        return found.map((u) => this.toDomain(u));
    }
    async save(user) {
        const orm = this.toOrm(user);
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }
    async delete(id) {
        await this.repo.delete(id);
    }
    async count() {
        return this.repo.count();
    }
};
TypeOrmUserRepository = __decorate([
    Injectable(),
    __param(0, InjectRepository(UserOrmEntity)),
    __metadata("design:paramtypes", [Repository])
], TypeOrmUserRepository);
export { TypeOrmUserRepository };
//# sourceMappingURL=typeorm-user.repository.js.map