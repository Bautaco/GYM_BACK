import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../application/users.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles, UserRole } from '../../shared/decorators/roles.decorator.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';
import { CreateUserAdminDto } from './dtos/create-user-admin.dto.js';
import { UpdateProfileDto } from './dtos/update-profile.dto.js';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // HU-01: Admin consulta listado de todos los usuarios
  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  async getAllUsersAdmin() {
    return this.usersService.getAllUsers();
  }

  // HU-01: Admin crea nuevos usuarios (Entrenadores y Atletas)
  @Post('admin/create')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createUserByAdmin(@Body() dto: CreateUserAdminDto) {
    return this.usersService.createUserByAdmin(dto);
  }

  // HU-01: Admin elimina un usuario
  @Delete('admin/:id')
  @Roles(UserRole.ADMIN)
  async deleteUserAdmin(
    @Param('id') id: string,
    @CurrentUser() adminUser: any,
  ) {
    return this.usersService.deleteUser(id, adminUser.id);
  }

  // Listado de entrenadores (para asignación)
  @Get('trainers')
  async getTrainers() {
    return this.usersService.getTrainers();
  }

  // Listado de atletas (para entrenadores y administradores)
  @Get('athletes')
  @Roles(UserRole.ENTRENADOR, UserRole.ADMIN)
  async getAthletes() {
    return this.usersService.getAthletes();
  }

  // HU-02: Autogestión de perfil (actualización de avatar, datos y contraseña)
  @Patch('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  // Alias para HU-02: PATCH /api/v1/profile
  @Patch('profile')
  async updateProfileAlias(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }
}
