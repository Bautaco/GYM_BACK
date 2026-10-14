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
import { Injectable, Inject, NotFoundException, BadRequestException, UnauthorizedException, ConflictException, } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../domain/user.repository.interface.js';
import { User } from '../domain/user.entity.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';
import bcrypt from 'bcryptjs';
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUserByAdmin(dto) {
        const existing = await this.userRepository.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException(`Ya existe un usuario registrado con el correo ${dto.email}`);
        }
        if (dto.role === UserRole.ATLETA && dto.trainerId) {
            const trainer = await this.userRepository.findById(dto.trainerId);
            if (!trainer || trainer.role !== UserRole.ENTRENADOR) {
                throw new BadRequestException('El entrenador asignado no es válido');
            }
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const newUser = new User('', dto.email.toLowerCase().trim(), passwordHash, dto.fullName.trim(), dto.role, new Date(), new Date(), dto.phone?.trim(), dto.notes?.trim(), dto.avatarUrl?.trim(), dto.role === UserRole.ATLETA ? dto.trainerId : undefined);
        const saved = await this.userRepository.save(newUser);
        return {
            id: saved.id,
            email: saved.email,
            fullName: saved.fullName,
            role: saved.role,
            phone: saved.phone,
            notes: saved.notes,
            avatarUrl: saved.avatarUrl,
            trainerId: saved.trainerId,
            createdAt: saved.createdAt,
        };
    }
    async getAllUsers() {
        const users = await this.userRepository.findAll();
        const trainersMap = new Map();
        users
            .filter((u) => u.role === UserRole.ENTRENADOR)
            .forEach((t) => trainersMap.set(t.id, t.fullName));
        return users.map((u) => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            role: u.role,
            phone: u.phone,
            notes: u.notes,
            avatarUrl: u.avatarUrl,
            trainerId: u.trainerId,
            trainerName: u.trainerId ? trainersMap.get(u.trainerId) || 'No asignado' : undefined,
            createdAt: u.createdAt,
        }));
    }
    async getAthletes() {
        const athletes = await this.userRepository.findByRole(UserRole.ATLETA);
        return athletes.map((a) => ({
            id: a.id,
            email: a.email,
            fullName: a.fullName,
            phone: a.phone,
            notes: a.notes,
            avatarUrl: a.avatarUrl,
            trainerId: a.trainerId,
            createdAt: a.createdAt,
        }));
    }
    async getTrainers() {
        const trainers = await this.userRepository.findByRole(UserRole.ENTRENADOR);
        return trainers.map((t) => ({
            id: t.id,
            email: t.email,
            fullName: t.fullName,
            phone: t.phone,
            notes: t.notes,
            avatarUrl: t.avatarUrl,
            createdAt: t.createdAt,
        }));
    }
    async getById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            phone: user.phone,
            notes: user.notes,
            avatarUrl: user.avatarUrl,
            trainerId: user.trainerId,
        };
    }
    async updateProfile(id, dto) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        if (dto.newPassword) {
            if (!dto.currentPassword) {
                throw new BadRequestException('Debes proporcionar tu contraseña actual para cambiarla.');
            }
            const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
            if (!isValid) {
                throw new UnauthorizedException('La contraseña actual es incorrecta.');
            }
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(dto.newPassword, salt);
        }
        if (dto.fullName && dto.fullName.trim()) {
            user.fullName = dto.fullName.trim();
        }
        if (dto.phone !== undefined) {
            user.phone = dto.phone.trim();
        }
        if (dto.notes !== undefined) {
            user.notes = dto.notes.trim();
        }
        if (dto.avatarUrl !== undefined) {
            user.avatarUrl = dto.avatarUrl.trim();
        }
        user.updatedAt = new Date();
        const updated = await this.userRepository.save(user);
        return {
            id: updated.id,
            email: updated.email,
            fullName: updated.fullName,
            role: updated.role,
            phone: updated.phone,
            notes: updated.notes,
            avatarUrl: updated.avatarUrl,
            trainerId: updated.trainerId,
            updatedAt: updated.updatedAt,
        };
    }
    async deleteUser(id, currentAdminId) {
        if (id === currentAdminId) {
            throw new BadRequestException('No puedes eliminar tu propia cuenta de Administrador.');
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await this.userRepository.delete(id);
        return { message: `Usuario ${user.fullName} eliminado exitosamente` };
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, Inject(USER_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map