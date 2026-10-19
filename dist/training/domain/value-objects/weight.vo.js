export class Weight {
    _value;
    constructor(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('El peso corporal debe ser un número válido');
        }
        if (value <= 0) {
            throw new Error('El peso corporal debe ser un valor positivo mayor a 0');
        }
        this._value = value;
    }
    get value() {
        return this._value;
    }
    equals(other) {
        if (!other || !(other instanceof Weight)) {
            return false;
        }
        return this._value === other._value;
    }
    toString() {
        return `${this._value} kg`;
    }
}
//# sourceMappingURL=weight.vo.js.map