import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ClientesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createClienteDto: CreateClienteDto, comercioId: number): import("@prisma/client").Prisma.Prisma__ClienteClient<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(comercioId?: number): import("@prisma/client").Prisma.PrismaPromise<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }[]>;
    findOne(id: number, comercioId?: number): Promise<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }>;
    update(id: number, updateClienteDto: UpdateClienteDto, comercioId?: number): Promise<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }>;
    remove(id: number, comercioId?: number): Promise<{
        nombre: string;
        apellido: string;
        estado: string;
        comercio_id: number;
        telefono: string | null;
        email: string | null;
        cliente_id: number;
    }>;
}
