export class LoggedSet {
  constructor(
    public readonly id: string,
    public exerciseId: string,
    public exerciseName: string,
    public setNumber: number,
    public actualReps: number,
    public actualWeightKg: number,
    public isCompleted: boolean,
  ) {
    if (actualWeightKg < 0) {
      throw new Error('El peso levantado no puede ser un valor negativo');
    }
    if (actualReps < 0) {
      throw new Error('Las repeticiones no pueden ser un valor negativo');
    }
  }
}
