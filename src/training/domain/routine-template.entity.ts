import { ExerciseItem } from './exercise-item.entity.js';

export class RoutineTemplate {
  constructor(
    public readonly id: string,
    public trainerId: string,
    public name: string,
    public description?: string,
    public category?: string, // ej. 'Empuje (Push)', 'Tracción (Pull)', 'Piernas (Legs)', 'Full Body', 'Fuerza 5x5'
    public exerciseItems: ExerciseItem[] = [],
    public createdAt?: Date,
  ) {}
}
