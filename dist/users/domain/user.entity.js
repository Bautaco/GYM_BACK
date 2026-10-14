import { UserRole } from '../../shared/decorators/roles.decorator.js';
export class User {
    id;
    email;
    passwordHash;
    fullName;
    role;
    createdAt;
    updatedAt;
    phone;
    notes;
    avatarUrl;
    trainerId;
    constructor(id, email, passwordHash, fullName, role, createdAt, updatedAt, phone, notes, avatarUrl, trainerId) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.phone = phone;
        this.notes = notes;
        this.avatarUrl = avatarUrl;
        this.trainerId = trainerId;
    }
    isAdmin() {
        return this.role === UserRole.ADMIN;
    }
    isTrainer() {
        return this.role === UserRole.ENTRENADOR;
    }
    isAthlete() {
        return this.role === UserRole.ATLETA;
    }
}
//# sourceMappingURL=user.entity.js.map