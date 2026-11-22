import { IsOptional, IsString } from 'class-validator';

/** Datos que un administrador puede modificar al asignar un atleta. */
export class AssignTrainerDto {
  @IsOptional()
  @IsString()
  trainerId?: string | null;
}
