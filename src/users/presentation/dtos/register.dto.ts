import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../../../shared/decorators/roles.decorator.js';

export class RegisterDto {
  @IsEmail({}, { message: 'Debe ingresar un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;

  @IsEnum(UserRole, { message: 'El rol debe ser ENTRENADOR o ATLETA' })
  role: UserRole;

  @IsOptional()
  phone?: string;

  @IsOptional()
  notes?: string;
}
