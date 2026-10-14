import { ExerciseItemDto } from './create-training-plan.dto.js';
export declare class CreateRoutineTemplateDto {
    name: string;
    description?: string;
    category?: string;
    exerciseItems: ExerciseItemDto[];
}
