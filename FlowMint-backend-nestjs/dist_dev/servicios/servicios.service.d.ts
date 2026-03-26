import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ServiciosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createServicioDto: CreateServicioDto, comercioId: number): import("@prisma/client").Prisma.Prisma__ServicioClient<{
        nombre: string;
        comercio_id: number;
        estado: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(comercioId?: number): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        comercio_id: number;
        estado: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }[]>;
    findOne(id: number, comercioId?: number): Promise<{
        nombre: string;
        comercio_id: number;
        estado: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }>;
    update(id: number, updateServicioDto: UpdateServicioDto, comercioId?: number): Promise<{
        nombre: string;
        comercio_id: number;
        estado: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }>;
    remove(id: number, comercioId?: number): Promise<{
        nombre: string;
        comercio_id: number;
        estado: string;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }>;
}
