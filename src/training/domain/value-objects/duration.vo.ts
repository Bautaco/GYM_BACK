/**
 * Value Object: Duration (Duración de la Sesión de Entrenamiento)
 * Duración en minutos de la sesión ejecutada (≥ 0).
 *
 * Agregado: WorkoutSession (TrainingContext)
 * Cumple con especificaciones de SPMP y DDD:
 * - Inmutabilidad (readonly, sin setters públicos)
 * - Comparación por valor (equals)
 * - Validación en constructor
 */
export class Duration {
  private readonly _minutes: number;

  constructor(minutes: number) {
    if (typeof minutes !== 'number' || isNaN(minutes)) {
      throw new Error('La duración debe ser un número válido');
    }
    if (minutes < 0) {
      throw new Error('La duración de la sesión no puede ser un valor negativo');
    }
    this._minutes = Math.round(minutes);
  }

  get minutes(): number {
    return this._minutes;
  }

  toHours(): number {
    return Math.round((this._minutes / 60) * 100) / 100;
  }

  equals(other: Duration | null | undefined): boolean {
    if (!other || !(other instanceof Duration)) {
      return false;
    }
    return this._minutes === other._minutes;
  }

  toString(): string {
    return `${this._minutes} min`;
  }
}
