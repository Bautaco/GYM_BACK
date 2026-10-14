import { UserRole } from '../../shared/decorators/roles.decorator.js';
export declare class UserOrmEntity {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    notes?: string;
    avatarUrl?: string;
    trainerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
