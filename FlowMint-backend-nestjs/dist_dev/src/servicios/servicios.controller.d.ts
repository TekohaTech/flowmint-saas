import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
export declare class ServiciosController {
    private readonly serviciosService;
    constructor(serviciosService: ServiciosService);
    create(createServicioDto: CreateServicioDto, req: any): import("@prisma/client").Prisma.Prisma__ServicioClient<{
        nombre: string;
        estado: string;
        comercio_id: number;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        estado: string;
        comercio_id: number;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }[]>;
    findOne(id: number, req: any): Promise<{
        nombre: string;
        estado: string;
        comercio_id: number;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }>;
    update(id: number, updateServicioDto: UpdateServicioDto, req: any): Promise<{
        nombre: string;
        estado: string;
        comercio_id: number;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }>;
    remove(id: number, req: any): Promise<{
        nombre: string;
        estado: string;
        comercio_id: number;
        descripcion: string | null;
        precio: number;
        duracion: number;
        servicio_id: number;
    }>;
}
