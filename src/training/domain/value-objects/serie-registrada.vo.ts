import { PesoKg } from './peso-kg.vo.js';

/**
 * Value Object: SerieRegistrada (LoggedSet según SPMP 6.5.2)
 * Detalle atómico de una serie realizada durante un entrenamiento.
 *
 * Resuelve la discrepancia arquitectónica:
 * - El SPMP (6.5.2) lo clasifica como Value Object (inmutable, sin setters, comparable por valor).
 * - La Memoria Técnica (3.4) y TypeORM lo gestionan con identidad persistida (UUID).
 * Esta clase representa la definición formal como Value Object puro.
 */
export class SerieRegistrada {
  private readonly _exerciseId: string;
  private readonly _exerciseName: string;
  private readonly _setNumber: number;
  private readonly _actualReps: number;
  private readonly _actualWeight: PesoKg;
  private readonly _isCompleted: boolean;

  constructor(
    exerciseId: string,
    exerciseName: string,
    setNumber: number,
    actualReps: number,
    actualWeight: PesoKg | number,
    isCompleted: boolean = true,
  ) {
    if (!exerciseId || exerciseId.trim() === '') {
      throw new Error('El ID de ejercicio es obligatorio en la serie');
    }
    if (setNumber < 1) {
      throw new Error('El número de serie debe ser mayor o igual a 1');
    }
    if (actualReps < 0) {
      throw new Error('Las repeticiones no pueden ser un valor negativo');
    }

    this._exerciseId = exerciseId;
    this._exerciseName = exerciseName || 'Ejercicio';
    this._setNumber = setNumber;
    this._actualReps = actualReps;
    this._actualWeight =
      actualWeight instanceof PesoKg ? actualWeight : new PesoKg(actualWeight);
    this._isCompleted = isCompleted;
  }

  get exerciseId(): string {
    return this._exerciseId;
  }

  get exerciseName(): string {
    return this._exerciseName;
  }

  get setNumber(): number {
    return this._setNumber;
  }

  get actualReps(): number {
    return this._actualReps;
  }

  get actualWeight(): PesoKg {
    return this._actualWeight;
  }

  get actualWeightKg(): number {
    return this._actualWeight.value;
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  equals(other: SerieRegistrada | null | undefined): boolean {
    if (!other || !(other instanceof SerieRegistrada)) {
      return false;
    }
    return (
      this._exerciseId === other._exerciseId &&
      this._setNumber === other._setNumber &&
      this._actualReps === other._actualReps &&
      this._actualWeight.equals(other._actualWeight) &&
      this._isCompleted === other._isCompleted
    );
  }

  toString(): string {
    return `Serie #${this._setNumber}: ${this._actualReps} reps x ${this._actualWeight.toString()} [${this._isCompleted ? 'OK' : 'INCOMPLETA'}]`;
  }
}
