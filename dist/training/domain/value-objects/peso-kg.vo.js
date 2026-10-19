export class PesoKg {
    _value;
    constructor(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('El peso levantado debe ser un número válido');
        }
        if (value < 0) {
            throw new Error('El peso levantado no puede ser un valor negativo');
        }
        this._value = value;
    }
    get value() {
        return this._value;
    }
    equals(other) {
        if (!other || !(other instanceof PesoKg)) {
            return false;
        }
        return this._value === other._value;
    }
    toString() {
        return `${this._value} kg`;
    }
}
//# sourceMappingURL=peso-kg.vo.js.map