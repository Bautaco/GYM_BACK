import { LoggedSet } from './logged-set.entity.js';

export class WorkoutSession {
  constructor(
    public readonly id: string,
    public athleteId: string,
    public trainingPlanId: string,
    public routineId: string,
    public routineName: string,
    public date: Date,
    public completed: boolean,
    public sets: LoggedSet[],
    public notes?: string,
    public rpe?: number, // RF-13: Calificación de esfuerzo percibido (1 a 10)
    public createdAt?: Date,
  ) {}

  totalVolume(): number {
    return this.sets
      .filter((s) => s.isCompleted)
      .reduce((acc, curr) => acc + curr.actualWeightKg * curr.actualReps, 0);
  }

  maxWeightForExercise(exerciseId: string): number {
    const matching = this.sets.filter(
      (s) => s.exerciseId === exerciseId && s.isCompleted,
    );
    if (matching.length === 0) return 0;
    return Math.max(...matching.map((s) => s.actualWeightKg));
  }

  // RF-08 / RF-10 / RF-11: 1RM estimado según fórmula de Epley: peso * (1 + reps / 30)
  max1RMForExercise(exerciseId: string): number {
    const matching = this.sets.filter(
      (s) => s.exerciseId === exerciseId && s.isCompleted,
    );
    if (matching.length === 0) return 0;
    const estimated1RMs = matching.map((s) => {
      if (s.actualReps <= 1) return s.actualWeightKg;
      return Math.round(s.actualWeightKg * (1 + s.actualReps / 30) * 10) / 10;
    });
    return Math.max(...estimated1RMs);
  }
}
