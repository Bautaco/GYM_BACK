var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { UserRole } from '../../shared/decorators/roles.decorator.js';
let UserOrmEntity = class UserOrmEntity {
    id;
    email;
    passwordHash;
    fullName;
    role;
    phone;
    notes;
    avatarUrl;
    trainerId;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "email", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "passwordHash", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "fullName", void 0);
__decorate([
    Column({
        type: 'varchar',
        default: UserRole.ATLETA,
    }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "role", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "phone", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "notes", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "avatarUrl", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], UserOrmEntity.prototype, "trainerId", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], UserOrmEntity.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], UserOrmEntity.prototype, "updatedAt", void 0);
UserOrmEntity = __decorate([
    Entity('users')
], UserOrmEntity);
export { UserOrmEntity };
//# sourceMappingURL=user.orm-entity.js.map