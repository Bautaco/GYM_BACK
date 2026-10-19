import { PesoKg } from './value-objects/peso-kg.vo.js';
import { SerieRegistrada } from './value-objects/serie-registrada.vo.js';
export declare class LoggedSet {
    readonly id: string;
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    actualReps: number;
    actualWeightKg: number;
    isCompleted: boolean;
    private readonly _peso;
    constructor(id: string, exerciseId: string, exerciseName: string, setNumber: number, actualReps: number, actualWeightKg: number, isCompleted: boolean);
    get peso(): PesoKg;
    toValueObject(): SerieRegistrada;
    static fromValueObject(vo: SerieRegistrada, id?: string): LoggedSet;
    equals(other: LoggedSet | null | undefined): boolean;
}
