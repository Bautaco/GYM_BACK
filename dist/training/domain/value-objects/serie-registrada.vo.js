import { PesoKg } from './peso-kg.vo.js';
export class SerieRegistrada {
    _exerciseId;
    _exerciseName;
    _setNumber;
    _actualReps;
    _actualWeight;
    _isCompleted;
    constructor(exerciseId, exerciseName, setNumber, actualReps, actualWeight, isCompleted = true) {
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
    get exerciseId() {
        return this._exerciseId;
    }
    get exerciseName() {
        return this._exerciseName;
    }
    get setNumber() {
        return this._setNumber;
    }
    get actualReps() {
        return this._actualReps;
    }
    get actualWeight() {
        return this._actualWeight;
    }
    get actualWeightKg() {
        return this._actualWeight.value;
    }
    get isCompleted() {
        return this._isCompleted;
    }
    equals(other) {
        if (!other || !(other instanceof SerieRegistrada)) {
            return false;
        }
        return (this._exerciseId === other._exerciseId &&
            this._setNumber === other._setNumber &&
            this._actualReps === other._actualReps &&
            this._actualWeight.equals(other._actualWeight) &&
            this._isCompleted === other._isCompleted);
    }
    toString() {
        return `Serie #${this._setNumber}: ${this._actualReps} reps x ${this._actualWeight.toString()} [${this._isCompleted ? 'OK' : 'INCOMPLETA'}]`;
    }
}
//# sourceMappingURL=serie-registrada.vo.js.map