import { PesoKg } from './value-objects/peso-kg.vo.js';
import { SerieRegistrada } from './value-objects/serie-registrada.vo.js';
export class LoggedSet {
    id;
    exerciseId;
    exerciseName;
    setNumber;
    actualReps;
    actualWeightKg;
    isCompleted;
    _peso;
    constructor(id, exerciseId, exerciseName, setNumber, actualReps, actualWeightKg, isCompleted) {
        this.id = id;
        this.exerciseId = exerciseId;
        this.exerciseName = exerciseName;
        this.setNumber = setNumber;
        this.actualReps = actualReps;
        this.actualWeightKg = actualWeightKg;
        this.isCompleted = isCompleted;
        this._peso = new PesoKg(actualWeightKg);
        if (actualReps < 0) {
            throw new Error('Las repeticiones no pueden ser un valor negativo');
        }
    }
    get peso() {
        return this._peso;
    }
    toValueObject() {
        return new SerieRegistrada(this.exerciseId, this.exerciseName, this.setNumber, this.actualReps, this._peso, this.isCompleted);
    }
    static fromValueObject(vo, id = '') {
        return new LoggedSet(id, vo.exerciseId, vo.exerciseName, vo.setNumber, vo.actualReps, vo.actualWeightKg, vo.isCompleted);
    }
    equals(other) {
        if (!other || !(other instanceof LoggedSet))
            return false;
        return this.toValueObject().equals(other.toValueObject());
    }
}
//# sourceMappingURL=logged-set.entity.js.map