import { ExerciseService } from '../application/exercise.service.js';
import { CreateExerciseDto } from './dtos/create-exercise.dto.js';
export declare class ExerciseController {
    private readonly exerciseService;
    constructor(exerciseService: ExerciseService);
    getAll(): Promise<import("../domain/exercise.entity.js").Exercise[]>;
    getById(id: string): Promise<import("../domain/exercise.entity.js").Exercise>;
    create(dto: CreateExerciseDto): Promise<import("../domain/exercise.entity.js").Exercise>;
    update(id: string, dto: Partial<CreateExerciseDto>): Promise<import("../domain/exercise.entity.js").Exercise>;
    delete(id: string): Promise<void>;
}
