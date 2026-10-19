import { Weight } from './value-objects/weight.vo.js';
export class BodyWeightRecord {
    id;
    athleteId;
    weightKg;
    recordedAt;
    notes;
    _weightVo;
    constructor(id, athleteId, weightKg, recordedAt, notes) {
        this.id = id;
        this.athleteId = athleteId;
        this.weightKg = weightKg;
        this.recordedAt = recordedAt;
        this.notes = notes;
        this._weightVo = new Weight(weightKg);
    }
    get weight() {
        return this._weightVo;
    }
}
//# sourceMappingURL=body-weight-record.entity.js.map