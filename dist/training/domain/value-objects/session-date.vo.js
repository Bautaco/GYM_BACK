export class SessionDate {
    _value;
    constructor(dateInput) {
        const parsed = dateInput instanceof Date
            ? new Date(dateInput.getTime())
            : new Date(dateInput);
        if (isNaN(parsed.getTime())) {
            throw new Error('Fecha de sesión inválida');
        }
        this._value = parsed;
    }
    get value() {
        return new Date(this._value.getTime());
    }
    toISOString() {
        return this._value.toISOString();
    }
    toDateString() {
        return this._value.toISOString().split('T')[0];
    }
    equals(other) {
        if (!other || !(other instanceof SessionDate)) {
            return false;
        }
        return this._value.getTime() === other._value.getTime();
    }
    toString() {
        return this.toDateString();
    }
}
//# sourceMappingURL=session-date.vo.js.map