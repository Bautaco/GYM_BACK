import { Weight } from './value-objects/weight.vo.js';
export declare class BodyWeightRecord {
    readonly id: string;
    athleteId: string;
    weightKg: number;
    recordedAt: Date;
    notes?: string | undefined;
    private readonly _weightVo;
    constructor(id: string, athleteId: string, weightKg: number, recordedAt: Date, notes?: string | undefined);
    get weight(): Weight;
}
