export declare class Weight {
    private readonly _value;
    constructor(value: number);
    get value(): number;
    equals(other: Weight | null | undefined): boolean;
    toString(): string;
}
