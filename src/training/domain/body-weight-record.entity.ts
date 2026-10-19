import { Weight } from './value-objects/weight.vo.js';

/**
 * Entidad de dominio BodyWeightRecord (AnalyticsContext).
 * Encapsula el Value Object Weight para el peso corporal antropométrico.
 */
export class BodyWeightRecord {
  private readonly _weightVo: Weight;

  constructor(
    public readonly id: string,
    public athleteId: string,
    public weightKg: number,
    public recordedAt: Date,
    public notes?: string,
  ) {
    this._weightVo = new Weight(weightKg);
  }

  get weight(): Weight {
    return this._weightVo;
  }
}
