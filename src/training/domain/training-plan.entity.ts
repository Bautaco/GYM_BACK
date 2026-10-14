import { Routine } from './routine.entity.js';

export class TrainingPlan {
  constructor(
    public readonly id: string,
    public name: string,
    public athleteId: string,
    public trainerId: string,
    public startDate: Date,
    public endDate: Date,
    public isActive: boolean,
    public routines: Routine[],
    public athleteName?: string,
    public trainerName?: string,
    public createdAt?: Date,
  ) {}

  deactivate(): void {
    this.isActive = false;
  }

  isCurrent(): boolean {
    const now = new Date();
    return this.isActive && this.startDate <= now && now <= this.endDate;
  }
}
