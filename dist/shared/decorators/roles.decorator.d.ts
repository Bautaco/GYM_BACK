export declare enum UserRole {
    ADMIN = "ADMIN",
    ENTRENADOR = "ENTRENADOR",
    ATLETA = "ATLETA"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
