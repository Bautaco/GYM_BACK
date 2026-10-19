import { PesoKg } from './value-objects/peso-kg.vo.js';
import { SerieRegistrada } from './value-objects/serie-registrada.vo.js';

/**
 * Entidad de dominio LoggedSet.
 *
 * Conecta el modelo relacional persistido (Memoria Técnica sección 3.4) con
 * el Value Object inmutable SerieRegistrada (SPMP sección 6.5.2) y el VO PesoKg.
 */
export class LoggedSet {
  private readonly _peso: PesoKg;

  constructor(
    public readonly id: string,
    public exerciseId: string,
    public exerciseName: string,
    public setNumber: number,
    public actualReps: number,
    public actualWeightKg: number,
    public isCompleted: boolean,
  ) {
    this._peso = new PesoKg(actualWeightKg);
    if (actualReps < 0) {
      throw new Error('Las repeticiones no pueden ser un valor negativo');
    }
  }

  get peso(): PesoKg {
    return this._peso;
  }

  toValueObject(): SerieRegistrada {
    return new SerieRegistrada(
      this.exerciseId,
      this.exerciseName,
      this.setNumber,
      this.actualReps,
      this._peso,
      this.isCompleted,
    );
  }

  static fromValueObject(vo: SerieRegistrada, id: string = ''): LoggedSet {
    return new LoggedSet(
      id,
      vo.exerciseId,
      vo.exerciseName,
      vo.setNumber,
      vo.actualReps,
      vo.actualWeightKg,
      vo.isCompleted,
    );
  }

  equals(other: LoggedSet | null | undefined): boolean {
    if (!other || !(other instanceof LoggedSet)) return false;
    return this.toValueObject().equals(other.toValueObject());
  }
}
