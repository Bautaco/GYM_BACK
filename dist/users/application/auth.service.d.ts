import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../domain/user.repository.interface.js';
import { User } from '../domain/user.entity.js';
import { LoginDto } from '../presentation/dtos/login.dto.js';
import { RegisterDto } from '../presentation/dtos/register.dto.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: IUserRepository, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<User>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: UserRole;
            phone: string | undefined;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: UserRole;
        };
    }>;
}
