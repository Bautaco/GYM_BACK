import { Strategy } from 'passport-jwt';
import { IUserRepository } from '../../domain/user.repository.interface.js';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    fullName: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import("../../../shared/decorators/roles.decorator.js").UserRole;
        fullName: string;
    }>;
}
export {};
