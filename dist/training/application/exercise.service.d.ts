import { Repository } from 'typeorm';
import { IExerciseRepository } from '../domain/exercise.repository.interface.js';
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
export declare class ExerciseService {
    private readonly exerciseRepo;
    private readonly muscleGroupRepo;
    private readonly targetZoneRepo;
    constructor(exerciseRepo: IExerciseRepository, muscleGroupRepo: Repository<MuscleGroupOrmEntity>, targetZoneRepo: Repository<TargetZoneOrmEntity>);
    getAllExercises(): Promise<Exercise[]>;
    getExerciseById(id: string): Promise<Exercise>;
    getMuscleGroups(): Promise<string[]>;
    getTargetZones(): Promise<string[]>;
    ensureMuscleGroupAndZones(grupo: string, zonas: string[]): Promise<void>;
    createMuscleGroup(name: string): Promise<string>;
    createTargetZone(name: string, muscleGroupName?: string): Promise<string>;
    createExercise(dto: CreateExerciseDto): Promise<Exercise>;
    updateExercise(id: string, dto: UpdateExerciseDto): Promise<Exercise>;
    deleteExercise(id: string): Promise<void>;
}
