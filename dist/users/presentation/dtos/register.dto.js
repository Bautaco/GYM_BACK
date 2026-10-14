var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../../../shared/decorators/roles.decorator.js';
export class RegisterDto {
    email;
    password;
    fullName;
    role;
    phone;
    notes;
}
__decorate([
    IsEmail({}, { message: 'Debe ingresar un email válido' }),
    IsNotEmpty({ message: 'El email es obligatorio' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    IsNotEmpty({ message: 'La contraseña es obligatoria' }),
    MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    IsNotEmpty({ message: 'El nombre completo es obligatorio' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    IsEnum(UserRole, { message: 'El rol debe ser ENTRENADOR o ATLETA' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", String)
], RegisterDto.prototype, "notes", void 0);
//# sourceMappingURL=register.dto.js.map