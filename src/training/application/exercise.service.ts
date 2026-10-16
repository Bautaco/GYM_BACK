import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IExerciseRepository, EXERCISE_REPOSITORY_TOKEN } from '../domain/exercise.repository.interface.js';
import { Exercise } from '../domain/exercise.entity.js';
import { CreateExerciseDto } from '../presentation/dtos/create-exercise.dto.js';
import { MuscleGroupOrmEntity } from '../infrastructure/muscle-group.orm-entity.js';
import { TargetZoneOrmEntity } from '../infrastructure/target-zone.orm-entity.js';

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
    @InjectRepository(MuscleGroupOrmEntity)
    private readonly muscleGroupRepo: Repository<MuscleGroupOrmEntity>,
    @InjectRepository(TargetZoneOrmEntity)
    private readonly targetZoneRepo: Repository<TargetZoneOrmEntity>,
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

  async getMuscleGroups(): Promise<string[]> {
    // Obtenemos los grupos registrados en la tabla específica
    const dbGroups = await this.muscleGroupRepo.find({ order: { name: 'ASC' } });
    const groupSet = new Set<string>(dbGroups.map((g) => g.name.trim()));

    // También rescatamos los grupos que pudieran existir en los ejercicios actuales
    const allExercises = await this.exerciseRepo.findAll();
    for (const ex of allExercises) {
      if (ex.grupoMuscularPrincipal && ex.grupoMuscularPrincipal.trim().length > 0) {
        groupSet.add(ex.grupoMuscularPrincipal.trim());
      }
    }

    // Grupos base de seguridad por si la base está completamente vacía
    const defaults = ['Piernas', 'Pecho', 'Espalda', 'Hombros', 'Brazos', 'Core'];
    for (const d of defaults) {
      groupSet.add(d);
    }

    return Array.from(groupSet).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }

  async getTargetZones(): Promise<string[]> {
    const dbZones = await this.targetZoneRepo.find({ order: { name: 'ASC' } });
    const zoneSet = new Set<string>(dbZones.map((z) => z.name.trim()));

    const allExercises = await this.exerciseRepo.findAll();
    for (const ex of allExercises) {
      if (Array.isArray(ex.zonasTrabajadas)) {
        for (const z of ex.zonasTrabajadas) {
          if (z && z.trim().length > 0) {
            zoneSet.add(z.trim());
          }
        }
      }
    }

    // Zonas base de referencia
    const defaults = [
      'Cuádriceps',
      'Glúteo Mayor',
      'Glúteo Medio',
      'Isquiotibiales',
      'Pectoral Mayor',
      'Pectoral Superior',
      'Deltoides Anterior',
      'Deltoides Lateral',
      'Deltoides Posterior',
      'Dorsal Ancho',
      'Trapecio',
      'Erectores Espinales',
      'Bíceps Braquial',
      'Tríceps Braquial',
      'Braquiorradial',
      'Abdomen',
      'Oblicuos',
      'Lumbares',
      'Aductores',
      'Gemelos',
    ];
    for (const d of defaults) {
      zoneSet.add(d);
    }

    return Array.from(zoneSet).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }

  async ensureMuscleGroupAndZones(grupo: string, zonas: string[]): Promise<void> {
    const trimmedGroup = grupo?.trim();
    if (trimmedGroup) {
      const existing = await this.muscleGroupRepo.find();
      const match = existing.find(
        (g) => g.name.trim().toLowerCase() === trimmedGroup.toLowerCase(),
      );
      if (!match) {
        const newGroup = this.muscleGroupRepo.create({ name: trimmedGroup });
        await this.muscleGroupRepo.save(newGroup);
      }
    }

    if (Array.isArray(zonas) && zonas.length > 0) {
      const existingZones = await this.targetZoneRepo.find();
      for (const rawZone of zonas) {
        const trimmedZone = rawZone?.trim();
        if (!trimmedZone) continue;

        const match = existingZones.find(
          (z) => z.name.trim().toLowerCase() === trimmedZone.toLowerCase(),
        );
        if (!match) {
          const newZone = this.targetZoneRepo.create({
            name: trimmedZone,
            muscleGroupName: trimmedGroup,
          });
          await this.targetZoneRepo.save(newZone);
        }
      }
    }
  }

  async createMuscleGroup(name: string): Promise<string> {
    const trimmed = name?.trim();
    if (!trimmed) return '';
    await this.ensureMuscleGroupAndZones(trimmed, []);
    return trimmed;
  }

  async createTargetZone(name: string, muscleGroupName?: string): Promise<string> {
    const trimmed = name?.trim();
    if (!trimmed) return '';
    const existing = await this.targetZoneRepo.find();
    const match = existing.find((z) => z.name.trim().toLowerCase() === trimmed.toLowerCase());
    if (!match) {
      const newZone = this.targetZoneRepo.create({
        name: trimmed,
        muscleGroupName: muscleGroupName?.trim(),
      });
      await this.targetZoneRepo.save(newZone);
    }
    return trimmed;
  }

  async createExercise(dto: CreateExerciseDto): Promise<Exercise> {
    const trimmedGroup = dto.grupoMuscularPrincipal.trim();
    const zones = Array.isArray(dto.zonasTrabajadas)
      ? dto.zonasTrabajadas.map((z) => z.trim()).filter((z) => z.length > 0)
      : [];

    // Garantizar persistencia automática de grupos musculares y zonas creadas sobre la marcha
    await this.ensureMuscleGroupAndZones(trimmedGroup, zones);

    const exercise = new Exercise(
      '',
      dto.nombre.trim(),
      trimmedGroup,
      zones.length > 0 ? zones : [trimmedGroup],
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

    let group = found.grupoMuscularPrincipal;
    let zones = found.zonasTrabajadas;

    if (dto.nombre !== undefined) found.nombre = dto.nombre.trim();
    if (dto.grupoMuscularPrincipal !== undefined) {
      group = dto.grupoMuscularPrincipal.trim();
      found.grupoMuscularPrincipal = group;
    }
    if (dto.zonasTrabajadas !== undefined) {
      zones = dto.zonasTrabajadas.map((z) => z.trim()).filter((z) => z.length > 0);
      found.zonasTrabajadas = zones;
    }
    if (dto.descripcion !== undefined) found.descripcion = dto.descripcion.trim();
    if (dto.videoUrl !== undefined) found.videoUrl = dto.videoUrl?.trim() || undefined;

    // Garantizar persistencia de cualquier valor nuevo ingresado
    await this.ensureMuscleGroupAndZones(group, zones || []);

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
