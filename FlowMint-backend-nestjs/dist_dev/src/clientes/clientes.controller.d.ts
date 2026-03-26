import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(createClienteDto: CreateClienteDto, req: any): import("@prisma/client").Prisma.Prisma__ClienteClient<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }[]>;
    findOne(id: number, req: any): Promise<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }>;
    update(id: number, updateClienteDto: UpdateClienteDto, req: any): Promise<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }>;
    remove(id: number, req: any): Promise<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }>;
}
