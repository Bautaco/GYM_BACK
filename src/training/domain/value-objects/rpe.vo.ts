/**
 * Value Object: RPE (Rate of Perceived Exertion)
 * Escala de esfuerzo percibido del atleta (valor entre 1 y 10).
 *
 * Cumple con especificaciones de SPMP secciones 4.1.2, 6.1.2, 6.4.2, 6.5.2 y 6.8.5:
 * - Inmutabilidad (readonly, sin setters públicos)
 * - Comparación por valor (equals)
 * - Validación en constructor
 */
export class Rpe {
  private readonly _value: number;

  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('El RPE debe ser un valor numérico');
    }
    if (value < 1 || value > 10) {
      throw new Error('El RPE debe estar comprendido en la escala de 1 a 10');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: Rpe | null | undefined): boolean {
    if (!other || !(other instanceof Rpe)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return `RPE ${this._value}`;
  }
}
