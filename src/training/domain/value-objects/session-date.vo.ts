/**
 * Value Object: SessionDate (Fecha de Ejecución de la Sesión)
 * Fecha y hora en la que se llevó a cabo el entrenamiento.
 *
 * Agregado: WorkoutSession (TrainingContext)
 * Cumple con especificaciones de SPMP y DDD:
 * - Inmutabilidad (copia defensiva en getter y constructor, sin setters públicos)
 * - Comparación por valor (equals)
 * - Validación en constructor
 */
export class SessionDate {
  private readonly _value: Date;

  constructor(dateInput: Date | string | number) {
    const parsed =
      dateInput instanceof Date
        ? new Date(dateInput.getTime())
        : new Date(dateInput);

    if (isNaN(parsed.getTime())) {
      throw new Error('Fecha de sesión inválida');
    }
    this._value = parsed;
  }

  get value(): Date {
    // Retorno defensivo para mantener la inmutabilidad
    return new Date(this._value.getTime());
  }

  toISOString(): string {
    return this._value.toISOString();
  }

  toDateString(): string {
    return this._value.toISOString().split('T')[0];
  }

  equals(other: SessionDate | null | undefined): boolean {
    if (!other || !(other instanceof SessionDate)) {
      return false;
    }
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this.toDateString();
  }
}
