export declare class SessionDate {
    private readonly _value;
    constructor(dateInput: Date | string | number);
    get value(): Date;
    toISOString(): string;
    toDateString(): string;
    equals(other: SessionDate | null | undefined): boolean;
    toString(): string;
}
