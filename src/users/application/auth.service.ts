import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../domain/user.repository.interface.js';
import { User } from '../domain/user.entity.js';
import { LoginDto } from '../presentation/dtos/login.dto.js';
import { RegisterDto } from '../presentation/dtos/register.dto.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
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

  async login(loginDto: LoginDto) {
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
        notes: user.notes,
        avatarUrl: user.avatarUrl,
        trainerId: user.trainerId,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con este correo electrónico');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const newUser = new User(
      '',
      registerDto.email.toLowerCase().trim(),
      passwordHash,
      registerDto.fullName.trim(),
      registerDto.role,
      new Date(),
      new Date(),
      registerDto.phone,
      registerDto.notes,
    );

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
        phone: saved.phone,
        notes: saved.notes,
        avatarUrl: saved.avatarUrl,
        trainerId: saved.trainerId,
      },
    };
  }
}
