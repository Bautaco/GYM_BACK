import { UserRole } from '../../shared/decorators/roles.decorator.js';
export declare class User {
    readonly id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    phone?: string | undefined;
    notes?: string | undefined;
    avatarUrl?: string | undefined;
    trainerId?: string | undefined;
    constructor(id: string, email: string, passwordHash: string, fullName: string, role: UserRole, createdAt: Date, updatedAt: Date, phone?: string | undefined, notes?: string | undefined, avatarUrl?: string | undefined, trainerId?: string | undefined);
    isAdmin(): boolean;
    isTrainer(): boolean;
    isAthlete(): boolean;
}
