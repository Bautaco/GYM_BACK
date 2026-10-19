export declare class Duration {
    private readonly _minutes;
    constructor(minutes: number);
    get minutes(): number;
    toHours(): number;
    equals(other: Duration | null | undefined): boolean;
    toString(): string;
}
