/**
 * Value Object: PesoKg
 * Peso levantado en kilogramos durante una serie de entrenamiento (≥ 0).
 *
 * Cumple con especificaciones de SPMP secciones 4.1.2, 6.4.2, 6.5.2 y 6.8.5:
 * - Inmutabilidad (readonly, sin setters públicos)
 * - Comparación por valor (equals)
 * - Validación en constructor
 */
export class PesoKg {
  private readonly _value: number;

  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('El peso levantado debe ser un número válido');
    }
    if (value < 0) {
      throw new Error('El peso levantado no puede ser un valor negativo');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: PesoKg | null | undefined): boolean {
    if (!other || !(other instanceof PesoKg)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return `${this._value} kg`;
  }
}
