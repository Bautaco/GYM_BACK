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
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_REPOSITORY_TOKEN } from '../../domain/user.repository.interface.js';
let JwtStrategy = class JwtStrategy extends PassportStrategy(Strategy) {
    userRepository;
    constructor(userRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'gym_super_secret_jwt_key_2026',
        });
        this.userRepository = userRepository;
    }
    async validate(payload) {
        const user = await this.userRepository.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('Usuario no válido o inexistente');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };
    }
};
JwtStrategy = __decorate([
    Injectable(),
    __param(0, Inject(USER_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [Object])
], JwtStrategy);
export { JwtStrategy };
//# sourceMappingURL=jwt.strategy.js.map