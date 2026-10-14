export class ExerciseItem {
  constructor(
    public readonly id: string,
    public exerciseId: string,
    public exerciseName: string,
    public targetSets: number,
    public targetReps: number,
    public targetWeightKg: number,
    public restSeconds?: number,
    public notes?: string,
    public cadence?: string, // RF-15: Cadencia/Tempo (ej. "3-0-1-0" o "3s excéntrico")
  ) {}
}
