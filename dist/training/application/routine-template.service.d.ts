import { IRoutineTemplateRepository } from '../domain/routine-template.repository.interface.js';
import { RoutineTemplate } from '../domain/routine-template.entity.js';
import { CreateRoutineTemplateDto } from '../presentation/dtos/create-routine-template.dto.js';
export declare class RoutineTemplateService {
    private readonly templateRepo;
    constructor(templateRepo: IRoutineTemplateRepository);
    createTemplate(trainerId: string, dto: CreateRoutineTemplateDto): Promise<RoutineTemplate>;
    getAllTemplates(trainerId?: string): Promise<RoutineTemplate[]>;
    getTemplateById(id: string): Promise<RoutineTemplate>;
    deleteTemplate(id: string): Promise<{
        message: string;
    }>;
}
