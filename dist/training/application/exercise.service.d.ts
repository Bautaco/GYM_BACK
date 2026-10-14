import { IExerciseRepository } from '../domain/exercise.repository.interface.js';
import { Exercise } from '../domain/exercise.entity.js';
import { CreateExerciseDto } from '../presentation/dtos/create-exercise.dto.js';
export interface UpdateExerciseDto {
    nombre?: string;
    grupoMuscularPrincipal?: string;
    zonasTrabajadas?: string[];
    descripcion?: string;
    videoUrl?: string | null;
}
export declare class ExerciseService {
    private readonly exerciseRepo;
    constructor(exerciseRepo: IExerciseRepository);
    getAllExercises(): Promise<Exercise[]>;
    getExerciseById(id: string): Promise<Exercise>;
    createExercise(dto: CreateExerciseDto): Promise<Exercise>;
    updateExercise(id: string, dto: UpdateExerciseDto): Promise<Exercise>;
    deleteExercise(id: string): Promise<void>;
}
