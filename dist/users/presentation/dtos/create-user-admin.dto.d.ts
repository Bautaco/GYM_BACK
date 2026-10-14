import { UserRole } from '../../../shared/decorators/roles.decorator.js';
export declare class CreateUserAdminDto {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    notes?: string;
    trainerId?: string;
    avatarUrl?: string;
}
