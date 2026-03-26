import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class EmpleadosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEmpleadoDto: CreateEmpleadoDto, comercioId: number): import("@prisma/client").Prisma.Prisma__EmpleadoClient<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(comercioId?: number): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }[]>;
    findOne(id: number, comercioId?: number): Promise<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }>;
    update(id: number, updateEmpleadoDto: UpdateEmpleadoDto, comercioId?: number): Promise<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }>;
    remove(id: number, comercioId?: number): Promise<{
        nombre: string;
        apellido: string;
        comercio_id: number;
        estado: string;
        puesto: string | null;
        empleado_id: number;
    }>;
}
