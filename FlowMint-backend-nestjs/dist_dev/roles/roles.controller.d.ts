import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): import("@prisma/client").Prisma.Prisma__RolClient<{
        nombre: string;
        rol_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        rol_id: number;
    }[]>;
    findOne(id: number): Promise<{
        nombre: string;
        rol_id: number;
    }>;
    update(id: number, updateRoleDto: UpdateRoleDto): import("@prisma/client").Prisma.Prisma__RolClient<{
        nombre: string;
        rol_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__RolClient<{
        nombre: string;
        rol_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
