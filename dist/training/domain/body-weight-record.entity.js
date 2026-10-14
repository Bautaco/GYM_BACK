export class BodyWeightRecord {
    id;
    athleteId;
    weightKg;
    recordedAt;
    notes;
    constructor(id, athleteId, weightKg, recordedAt, notes) {
        this.id = id;
        this.athleteId = athleteId;
        this.weightKg = weightKg;
        this.recordedAt = recordedAt;
        this.notes = notes;
        if (weightKg <= 0) {
            throw new Error('El peso corporal debe ser un número positivo mayor a 0');
        }
    }
}
//# sourceMappingURL=body-weight-record.entity.js.map