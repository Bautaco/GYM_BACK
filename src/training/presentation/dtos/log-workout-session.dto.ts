import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LoggedSetDto {
  @IsNotEmpty({ message: 'El ID de ejercicio es obligatorio' })
  @IsString()
  exerciseId: string;

  @IsNotEmpty({ message: 'El nombre del ejercicio es obligatorio' })
  @IsString()
  exerciseName: string;

  @IsInt({ message: 'El número de serie debe ser entero' })
  @Min(1)
  setNumber: number;

  @IsInt({ message: 'Las repeticiones reales deben ser un número entero' })
  @Min(0, { message: 'Las repeticiones no pueden ser negativas' })
  actualReps: number;

  @IsNumber({}, { message: 'El peso real levantado debe ser numérico' })
  @Min(0, { message: 'El peso levantado no puede ser un valor negativo' })
  actualWeightKg: number;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class LogWorkoutSessionDto {
  @IsNotEmpty({ message: 'El ID del atleta es obligatorio' })
  @IsString()
  athleteId: string;

  @IsNotEmpty({ message: 'El ID del plan es obligatorio' })
  @IsString()
  trainingPlanId: string;

  @IsNotEmpty({ message: 'El ID de la rutina es obligatorio' })
  @IsString()
  routineId: string;

  @IsNotEmpty({ message: 'El nombre de la rutina es obligatorio' })
  @IsString()
  routineName: string;

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsDateString({}, { message: 'Formato de fecha inválido (YYYY-MM-DD)' })
  date: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt({ message: 'El RPE debe ser un número entero entre 1 y 10' })
  @Min(1, { message: 'El RPE mínimo es 1' })
  @Max(10, { message: 'El RPE máximo es 10' })
  rpe?: number; // RF-13: Calificación de esfuerzo subjetivo (1 a 10)

  @IsArray({ message: 'Debe enviar la lista de series ejecutadas' })
  @ValidateNested({ each: true })
  @Type(() => LoggedSetDto)
  sets: LoggedSetDto[];
}
