import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IExerciseRepository, EXERCISE_REPOSITORY_TOKEN } from '../domain/exercise.repository.interface.js';
import { Exercise } from '../domain/exercise.entity.js';
import { CreateExerciseDto } from '../presentation/dtos/create-exercise.dto.js';

export interface UpdateExerciseDto {
  nombre?: string;
  grupoMuscularPrincipal?: string;
  zonasTrabajadas?: string[];
  descripcion?: string;
  videoUrl?: string | null;
}

@Injectable()
export class ExerciseService {
  constructor(
    @Inject(EXERCISE_REPOSITORY_TOKEN)
    private readonly exerciseRepo: IExerciseRepository,
  ) {}

  async getAllExercises(): Promise<Exercise[]> {
    return this.exerciseRepo.findAll();
  }

  async getExerciseById(id: string): Promise<Exercise> {
    const found = await this.exerciseRepo.findById(id);
    if (!found) {
      throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
    }
    return found;
  }

  async createExercise(dto: CreateExerciseDto): Promise<Exercise> {
    const exercise = new Exercise(
      '',
      dto.nombre.trim(),
      dto.grupoMuscularPrincipal.trim(),
      dto.zonasTrabajadas,
      dto.descripcion.trim(),
      dto.videoUrl?.trim(),
      new Date(),
    );
    return this.exerciseRepo.save(exercise);
  }

  async updateExercise(id: string, dto: UpdateExerciseDto): Promise<Exercise> {
    const found = await this.exerciseRepo.findById(id);
    if (!found) {
      throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
    }
    if (dto.nombre !== undefined) found.nombre = dto.nombre.trim();
    if (dto.grupoMuscularPrincipal !== undefined) found.grupoMuscularPrincipal = dto.grupoMuscularPrincipal.trim();
    if (dto.zonasTrabajadas !== undefined) found.zonasTrabajadas = dto.zonasTrabajadas;
    if (dto.descripcion !== undefined) found.descripcion = dto.descripcion.trim();
    if (dto.videoUrl !== undefined) found.videoUrl = dto.videoUrl?.trim() || undefined;
    return this.exerciseRepo.save(found);
  }

  async deleteExercise(id: string): Promise<void> {
    const found = await this.exerciseRepo.findById(id);
    if (!found) {
      throw new NotFoundException(`Ejercicio con ID ${id} no encontrado`);
    }
    await this.exerciseRepo.delete(id);
  }
}
