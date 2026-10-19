/**
 * Value Object: Weight (Peso Corporal Antropométrico)
 * Peso corporal del atleta en kilogramos (> 0).
 *
 * Agregado: BodyWeightRecord (AnalyticsContext)
 * Cumple con especificaciones de SPMP y DDD:
 * - Inmutabilidad (readonly, sin setters públicos)
 * - Comparación por valor (equals)
 * - Validación en constructor (debe ser estrictamente positivo)
 */
export class Weight {
  private readonly _value: number;

  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('El peso corporal debe ser un número válido');
    }
    if (value <= 0) {
      throw new Error('El peso corporal debe ser un valor positivo mayor a 0');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: Weight | null | undefined): boolean {
    if (!other || !(other instanceof Weight)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return `${this._value} kg`;
  }
}
