import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExerciseItemDto {
  @IsNotEmpty({ message: 'El ID de ejercicio es obligatorio' })
  @IsString()
  exerciseId: string;

  @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
  @IsString()
  exerciseName: string;

  @IsInt({ message: 'Las series deben ser un entero' })
  @Min(1, { message: 'Debe tener al menos 1 serie' })
  targetSets: number;

  @IsInt({ message: 'Las repeticiones deben ser un entero' })
  @Min(1, { message: 'Debe tener al menos 1 repetición' })
  targetReps: number;

  @IsNumber({}, { message: 'La carga objetivo debe ser un número' })
  @Min(0, { message: 'La carga objetivo no puede ser negativa' })
  targetWeightKg: number;

  @IsOptional()
  @IsInt()
  restSeconds?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  cadence?: string; // RF-15: Cadencia / Tempo (ej. "3-0-1-0")
}

export class RoutineDto {
  @IsNotEmpty({ message: 'El nombre de la rutina es obligatorio' })
  @IsString()
  name: string;

  @IsInt({ message: 'El día de la semana debe ser un número entero (1-7)' })
  dayOfWeek: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseItemDto)
  exerciseItems: ExerciseItemDto[];
}

export class CreateTrainingPlanDto {
  @IsNotEmpty({ message: 'El nombre del plan de entrenamiento es obligatorio' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'El ID del atleta es obligatorio' })
  @IsString()
  athleteId: string;

  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato YYYY-MM-DD' })
  startDate: string;

  @IsNotEmpty({ message: 'La fecha de finalización es obligatoria' })
  @IsDateString({}, { message: 'La fecha de fin debe tener formato YYYY-MM-DD' })
  endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutineDto)
  routines: RoutineDto[];
}
