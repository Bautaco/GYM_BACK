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
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { UsersService } from '../application/users.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';
import { CreateUserAdminDto } from './dtos/create-user-admin.dto.js';
import { UpdateProfileDto } from './dtos/update-profile.dto.js';
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAllUsersAdmin() {
        return this.usersService.getAllUsers();
    }
    async createUserByAdmin(dto) {
        return this.usersService.createUserByAdmin(dto);
    }
    async deleteUserAdmin(id, adminUser) {
        return this.usersService.deleteUser(id, adminUser.id);
    }
    async getTrainers() {
        return this.usersService.getTrainers();
    }
    async getAthletes() {
        return this.usersService.getAthletes();
    }
    async updateProfile(user, dto) {
        return this.usersService.updateProfile(user.id, dto);
    }
    async updateProfileAlias(user, dto) {
        return this.usersService.updateProfile(user.id, dto);
    }
    async getUserById(id) {
        return this.usersService.getById(id);
    }
};
__decorate([
    Get('admin/all'),
    Roles(UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsersAdmin", null);
__decorate([
    Post('admin/create'),
    Roles(UserRole.ADMIN),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserAdminDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUserByAdmin", null);
__decorate([
    Delete('admin/:id'),
    Roles(UserRole.ADMIN),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUserAdmin", null);
__decorate([
    Get('trainers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getTrainers", null);
__decorate([
    Get('athletes'),
    Roles(UserRole.ENTRENADOR, UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAthletes", null);
__decorate([
    Patch('me'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    Patch('profile'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfileAlias", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
UsersController = __decorate([
    Controller('api/v1/users'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map