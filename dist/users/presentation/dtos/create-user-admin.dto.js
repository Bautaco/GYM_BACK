var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, } from 'class-validator';
import { UserRole } from '../../../shared/decorators/roles.decorator.js';
export class CreateUserAdminDto {
    email;
    password;
    fullName;
    role;
    phone;
    notes;
    trainerId;
    avatarUrl;
}
__decorate([
    IsNotEmpty({ message: 'El correo electrónico es obligatorio' }),
    IsEmail({}, { message: 'El correo electrónico no es válido' }),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "email", void 0);
__decorate([
    IsNotEmpty({ message: 'La contraseña es obligatoria' }),
    MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "password", void 0);
__decorate([
    IsNotEmpty({ message: 'El nombre completo es obligatorio' }),
    IsString(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "fullName", void 0);
__decorate([
    IsNotEmpty({ message: 'El rol es obligatorio' }),
    IsEnum(UserRole, { message: 'El rol debe ser ADMIN, ENTRENADOR o ATLETA' }),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "role", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "notes", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "trainerId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateUserAdminDto.prototype, "avatarUrl", void 0);
//# sourceMappingURL=create-user-admin.dto.js.map