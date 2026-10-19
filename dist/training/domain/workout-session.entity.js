import { Rpe } from './value-objects/rpe.vo.js';
import { SessionDate } from './value-objects/session-date.vo.js';
import { Duration } from './value-objects/duration.vo.js';
export class WorkoutSession {
    id;
    athleteId;
    trainingPlanId;
    routineId;
    routineName;
    date;
    completed;
    sets;
    notes;
    rpe;
    createdAt;
    durationMinutes;
    _sessionDate;
    _rpeVo;
    _durationVo;
    constructor(id, athleteId, trainingPlanId, routineId, routineName, date, completed, sets, notes, rpe, createdAt, durationMinutes) {
        this.id = id;
        this.athleteId = athleteId;
        this.trainingPlanId = trainingPlanId;
        this.routineId = routineId;
        this.routineName = routineName;
        this.date = date;
        this.completed = completed;
        this.sets = sets;
        this.notes = notes;
        this.rpe = rpe;
        this.createdAt = createdAt;
        this.durationMinutes = durationMinutes;
        this._sessionDate = new SessionDate(date);
        if (rpe !== undefined && rpe !== null) {
            this._rpeVo = new Rpe(rpe);
        }
        if (durationMinutes !== undefined && durationMinutes !== null) {
            this._durationVo = new Duration(durationMinutes);
        }
    }
    get sessionDate() {
        return this._sessionDate;
    }
    get rpeVo() {
        return this._rpeVo;
    }
    get duration() {
        return this._durationVo;
    }
    get seriesRegistradas() {
        return (this.sets || []).map((s) => s.toValueObject());
    }
    totalVolume() {
        return this.sets
            .filter((s) => s.isCompleted)
            .reduce((acc, curr) => acc + curr.actualWeightKg * curr.actualReps, 0);
    }
    maxWeightForExercise(exerciseId) {
        const matching = this.sets.filter((s) => s.exerciseId === exerciseId && s.isCompleted);
        if (matching.length === 0)
            return 0;
        return Math.max(...matching.map((s) => s.actualWeightKg));
    }
    max1RMForExercise(exerciseId) {
        const matching = this.sets.filter((s) => s.exerciseId === exerciseId && s.isCompleted);
        if (matching.length === 0)
            return 0;
        const estimated1RMs = matching.map((s) => {
            if (s.actualReps <= 1)
                return s.actualWeightKg;
            return Math.round(s.actualWeightKg * (1 + s.actualReps / 30) * 10) / 10;
        });
        return Math.max(...estimated1RMs);
    }
}
//# sourceMappingURL=workout-session.entity.js.map