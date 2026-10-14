import { UserRole } from '../../../shared/decorators/roles.decorator.js';
export declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    notes?: string;
}
