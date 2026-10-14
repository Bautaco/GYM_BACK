export declare class BodyWeightRecord {
    readonly id: string;
    athleteId: string;
    weightKg: number;
    recordedAt: Date;
    notes?: string | undefined;
    constructor(id: string, athleteId: string, weightKg: number, recordedAt: Date, notes?: string | undefined);
}
