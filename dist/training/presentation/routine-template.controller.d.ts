import { RoutineTemplateService } from '../application/routine-template.service.js';
import { CreateRoutineTemplateDto } from './dtos/create-routine-template.dto.js';
export declare class RoutineTemplateController {
    private readonly templateService;
    constructor(templateService: RoutineTemplateService);
    getTemplates(user: any): Promise<import("../domain/routine-template.entity.js").RoutineTemplate[]>;
    getTemplateById(id: string): Promise<import("../domain/routine-template.entity.js").RoutineTemplate>;
    createTemplate(user: any, dto: CreateRoutineTemplateDto): Promise<import("../domain/routine-template.entity.js").RoutineTemplate>;
    deleteTemplate(id: string): Promise<{
        message: string;
    }>;
}
