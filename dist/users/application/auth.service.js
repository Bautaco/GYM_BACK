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
import { Injectable, UnauthorizedException, ConflictException, Inject, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { USER_REPOSITORY_TOKEN } from '../domain/user.repository.interface.js';
import { User } from '../domain/user.entity.js';
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return user;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                phone: user.phone,
            },
        };
    }
    async register(registerDto) {
        const existing = await this.userRepository.findByEmail(registerDto.email);
        if (existing) {
            throw new ConflictException('Ya existe un usuario con este correo electrónico');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(registerDto.password, salt);
        const newUser = new User('', registerDto.email.toLowerCase().trim(), passwordHash, registerDto.fullName.trim(), registerDto.role, new Date(), new Date(), registerDto.phone, registerDto.notes);
        const saved = await this.userRepository.save(newUser);
        const payload = {
            sub: saved.id,
            email: saved.email,
            role: saved.role,
            fullName: saved.fullName,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: saved.id,
                email: saved.email,
                fullName: saved.fullName,
                role: saved.role,
            },
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, Inject(USER_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object, JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map