import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../../../shared/decorators/roles.decorator.js';

export class CreateUserAdminDto {
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'El rol es obligatorio' })
  @IsEnum(UserRole, { message: 'El rol debe ser ADMIN, ENTRENADOR o ATLETA' })
  role: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @ValidateIf((o) => o.role === UserRole.ATLETA)
  @IsNotEmpty({ message: 'Todo atleta debe tener un entrenador asignado' })
  @IsString({ message: 'El identificador del entrenador debe ser válido' })
  trainerId?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
