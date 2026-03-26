import { RolNombre } from 'src/roles/entities/rol-nombre.enum';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: RolNombre[]) => import("@nestjs/common").CustomDecorator<string>;
