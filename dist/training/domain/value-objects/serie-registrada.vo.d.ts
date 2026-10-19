import { PesoKg } from './peso-kg.vo.js';
export declare class SerieRegistrada {
    private readonly _exerciseId;
    private readonly _exerciseName;
    private readonly _setNumber;
    private readonly _actualReps;
    private readonly _actualWeight;
    private readonly _isCompleted;
    constructor(exerciseId: string, exerciseName: string, setNumber: number, actualReps: number, actualWeight: PesoKg | number, isCompleted?: boolean);
    get exerciseId(): string;
    get exerciseName(): string;
    get setNumber(): number;
    get actualReps(): number;
    get actualWeight(): PesoKg;
    get actualWeightKg(): number;
    get isCompleted(): boolean;
    equals(other: SerieRegistrada | null | undefined): boolean;
    toString(): string;
}
