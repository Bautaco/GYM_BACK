export class BodyWeightRecord {
  constructor(
    public readonly id: string,
    public athleteId: string,
    public weightKg: number,
    public recordedAt: Date,
    public notes?: string,
  ) {
    if (weightKg <= 0) {
      throw new Error('El peso corporal debe ser un número positivo mayor a 0');
    }
  }
}
