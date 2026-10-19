export class Rpe {
    _value;
    constructor(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('El RPE debe ser un valor numérico');
        }
        if (value < 1 || value > 10) {
            throw new Error('El RPE debe estar comprendido en la escala de 1 a 10');
        }
        this._value = value;
    }
    get value() {
        return this._value;
    }
    equals(other) {
        if (!other || !(other instanceof Rpe)) {
            return false;
        }
        return this._value === other._value;
    }
    toString() {
        return `RPE ${this._value}`;
    }
}
//# sourceMappingURL=rpe.vo.js.map