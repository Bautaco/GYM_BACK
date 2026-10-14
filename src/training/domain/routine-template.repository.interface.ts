import { RoutineTemplate } from './routine-template.entity.js';

export const ROUTINE_TEMPLATE_REPOSITORY_TOKEN = 'ROUTINE_TEMPLATE_REPOSITORY_TOKEN';

export interface IRoutineTemplateRepository {
  save(template: RoutineTemplate): Promise<RoutineTemplate>;
  findById(id: string): Promise<RoutineTemplate | null>;
  findAll(trainerId?: string): Promise<RoutineTemplate[]>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}
