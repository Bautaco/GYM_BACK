var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserOrmEntity } from './infrastructure/user.orm-entity.js';
import { USER_REPOSITORY_TOKEN } from './domain/user.repository.interface.js';
import { TypeOrmUserRepository } from './infrastructure/typeorm-user.repository.js';
import { AuthService } from './application/auth.service.js';
import { UsersService } from './application/users.service.js';
import { AuthController } from './presentation/auth.controller.js';
import { UsersController } from './presentation/users.controller.js';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy.js';
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature([UserOrmEntity]),
            PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.register({
                secret: process.env.JWT_SECRET || 'gym_super_secret_jwt_key_2026',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        controllers: [AuthController, UsersController],
        providers: [
            {
                provide: USER_REPOSITORY_TOKEN,
                useClass: TypeOrmUserRepository,
            },
            AuthService,
            UsersService,
            JwtStrategy,
        ],
        exports: [USER_REPOSITORY_TOKEN, AuthService, UsersService, JwtModule],
    })
], UsersModule);
export { UsersModule };
//# sourceMappingURL=users.module.js.map