export class Duration {
    _minutes;
    constructor(minutes) {
        if (typeof minutes !== 'number' || isNaN(minutes)) {
            throw new Error('La duración debe ser un número válido');
        }
        if (minutes < 0) {
            throw new Error('La duración de la sesión no puede ser un valor negativo');
        }
        this._minutes = Math.round(minutes);
    }
    get minutes() {
        return this._minutes;
    }
    toHours() {
        return Math.round((this._minutes / 60) * 100) / 100;
    }
    equals(other) {
        if (!other || !(other instanceof Duration)) {
            return false;
        }
        return this._minutes === other._minutes;
    }
    toString() {
        return `${this._minutes} min`;
    }
}
//# sourceMappingURL=duration.vo.js.map