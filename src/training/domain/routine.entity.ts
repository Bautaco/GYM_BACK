import { ExerciseItem } from './exercise-item.entity.js';

export class Routine {
  constructor(
    public readonly id: string,
    public name: string,
    public dayOfWeek: number, // 1 = Lunes, 2 = Martes, etc.
    public exerciseItems: ExerciseItem[],
    public description?: string,
  ) {}
}
