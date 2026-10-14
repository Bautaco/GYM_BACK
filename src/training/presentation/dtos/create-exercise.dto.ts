import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'El grupo muscular principal es obligatorio' })
  @IsString()
  grupoMuscularPrincipal: string;

  @IsArray({ message: 'Las zonas trabajadas deben ser una lista' })
  @IsNotEmpty({ message: 'Debe especificar al menos una zona trabajada' })
  zonasTrabajadas: string[];

  @IsNotEmpty({ message: 'La descripción técnica es obligatoria' })
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;
}
