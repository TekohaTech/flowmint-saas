import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
export declare class EmpleadosController {
    private readonly empleadosService;
    constructor(empleadosService: EmpleadosService);
    create(createEmpleadoDto: CreateEmpleadoDto, req: any): import("@prisma/client").Prisma.Prisma__EmpleadoClient<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }[]>;
    findOne(id: number, req: any): Promise<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }>;
    update(id: number, updateEmpleadoDto: UpdateEmpleadoDto, req: any): Promise<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }>;
    remove(id: number, req: any): Promise<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }>;
}
