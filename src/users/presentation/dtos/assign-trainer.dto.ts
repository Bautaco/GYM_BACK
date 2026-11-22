import { IsNotEmpty, IsString } from 'class-validator';

/** Datos que un administrador puede modificar al asignar un atleta. */
export class AssignTrainerDto {
  @IsNotEmpty({ message: 'Todo atleta debe tener un entrenador asignado' })
  @IsString({ message: 'El identificador del entrenador debe ser válido' })
  trainerId: string;
}
