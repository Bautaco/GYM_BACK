import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class LogBodyWeightDto {
  @IsNotEmpty({ message: 'El peso en kilogramos es obligatorio' })
  @IsNumber({}, { message: 'El peso debe ser un número válido' })
  @IsPositive({ message: 'El peso debe ser mayor a 0 kg' })
  weightKg: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
