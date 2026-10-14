import { IUserRepository } from '../domain/user.repository.interface.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';
import { CreateUserAdminDto } from '../presentation/dtos/create-user-admin.dto.js';
import { UpdateProfileDto } from '../presentation/dtos/update-profile.dto.js';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    createUserByAdmin(dto: CreateUserAdminDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
        phone: string | undefined;
        notes: string | undefined;
        avatarUrl: string | undefined;
        trainerId: string | undefined;
        createdAt: Date;
    }>;
    getAllUsers(): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
        phone: string | undefined;
        notes: string | undefined;
        avatarUrl: string | undefined;
        trainerId: string | undefined;
        trainerName: string | undefined;
        createdAt: Date;
    }[]>;
    getAthletes(): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | undefined;
        notes: string | undefined;
        avatarUrl: string | undefined;
        trainerId: string | undefined;
        createdAt: Date;
    }[]>;
    getTrainers(): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | undefined;
        notes: string | undefined;
        avatarUrl: string | undefined;
        createdAt: Date;
    }[]>;
    getById(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
        phone: string | undefined;
        notes: string | undefined;
        avatarUrl: string | undefined;
        trainerId: string | undefined;
    }>;
    updateProfile(id: string, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
        phone: string | undefined;
        notes: string | undefined;
        avatarUrl: string | undefined;
        trainerId: string | undefined;
        updatedAt: Date;
    }>;
    deleteUser(id: string, currentAdminId: string): Promise<{
        message: string;
    }>;
}
