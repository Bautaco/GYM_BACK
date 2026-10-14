import { UsersService } from '../application/users.service.js';
import { UserRole } from '../../shared/decorators/roles.decorator.js';
import { CreateUserAdminDto } from './dtos/create-user-admin.dto.js';
import { UpdateProfileDto } from './dtos/update-profile.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsersAdmin(): Promise<{
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
    deleteUserAdmin(id: string, adminUser: any): Promise<{
        message: string;
    }>;
    getTrainers(): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | undefined;
        notes: string | undefined;
        avatarUrl: string | undefined;
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
    updateProfile(user: any, dto: UpdateProfileDto): Promise<{
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
    updateProfileAlias(user: any, dto: UpdateProfileDto): Promise<{
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
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: UserRole;
        phone: string | undefined;
        notes: string | undefined;
        avatarUrl: string | undefined;
        trainerId: string | undefined;
    }>;
}
