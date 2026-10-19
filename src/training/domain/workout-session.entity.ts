import { LoggedSet } from './logged-set.entity.js';
import { Rpe } from './value-objects/rpe.vo.js';
import { SessionDate } from './value-objects/session-date.vo.js';
import { Duration } from './value-objects/duration.vo.js';
import { SerieRegistrada } from './value-objects/serie-registrada.vo.js';

/**
 * Raíz de Agregado: WorkoutSession (Sesión de Entrenamiento).
 * Bounded Context: TrainingContext.
 *
 * Integra y valida los Value Objects definidos en SPMP:
 * - RPE (Escala 1 a 10)
 * - SessionDate (Fecha y hora de ejecución)
 * - Duration (Duración en minutos)
 * - SerieRegistrada / PesoKg (Series y cargas ejecutadas)
 */
export class WorkoutSession {
  private readonly _sessionDate: SessionDate;
  private readonly _rpeVo?: Rpe;
  private readonly _durationVo?: Duration;

  constructor(
    public readonly id: string,
    public athleteId: string,
    public trainingPlanId: string,
    public routineId: string,
    public routineName: string,
    public date: Date,
    public completed: boolean,
    public sets: LoggedSet[],
    public notes?: string,
    public rpe?: number, // RF-13: Calificación de esfuerzo percibido (1 a 10)
    public createdAt?: Date,
    public durationMinutes?: number, // Duración en minutos
  ) {
    this._sessionDate = new SessionDate(date);
    if (rpe !== undefined && rpe !== null) {
      this._rpeVo = new Rpe(rpe);
    }
    if (durationMinutes !== undefined && durationMinutes !== null) {
      this._durationVo = new Duration(durationMinutes);
    }
  }

  get sessionDate(): SessionDate {
    return this._sessionDate;
  }

  get rpeVo(): Rpe | undefined {
    return this._rpeVo;
  }

  get duration(): Duration | undefined {
    return this._durationVo;
  }

  get seriesRegistradas(): SerieRegistrada[] {
    return (this.sets || []).map((s) => s.toValueObject());
  }

  totalVolume(): number {
    return this.sets
      .filter((s) => s.isCompleted)
      .reduce((acc, curr) => acc + curr.actualWeightKg * curr.actualReps, 0);
  }

  maxWeightForExercise(exerciseId: string): number {
    const matching = this.sets.filter(
      (s) => s.exerciseId === exerciseId && s.isCompleted,
    );
    if (matching.length === 0) return 0;
    return Math.max(...matching.map((s) => s.actualWeightKg));
  }

  // RF-08 / RF-10 / RF-11: 1RM estimado según fórmula de Epley: peso * (1 + reps / 30)
  max1RMForExercise(exerciseId: string): number {
    const matching = this.sets.filter(
      (s) => s.exerciseId === exerciseId && s.isCompleted,
    );
    if (matching.length === 0) return 0;
    const estimated1RMs = matching.map((s) => {
      if (s.actualReps <= 1) return s.actualWeightKg;
      return Math.round(s.actualWeightKg * (1 + s.actualReps / 30) * 10) / 10;
    });
    return Math.max(...estimated1RMs);
  }
}
