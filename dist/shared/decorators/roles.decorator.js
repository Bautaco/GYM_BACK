import { SetMetadata } from '@nestjs/common';
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["ENTRENADOR"] = "ENTRENADOR";
    UserRole["ATLETA"] = "ATLETA";
})(UserRole || (UserRole = {}));
export const ROLES_KEY = 'roles';
export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);
//# sourceMappingURL=roles.decorator.js.map