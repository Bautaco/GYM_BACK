import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseItemDto } from './create-training-plan.dto.js';

export class CreateRoutineTemplateDto {
  @IsNotEmpty({ message: 'El nombre de la plantilla es obligatorio' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsArray({ message: 'Debe incluir al menos un ejercicio en la plantilla' })
  @ValidateNested({ each: true })
  @Type(() => ExerciseItemDto)
  exerciseItems: ExerciseItemDto[];
}
