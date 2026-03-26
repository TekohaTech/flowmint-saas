import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class TurnosService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkAvailability;
    create(createTurnoDto: CreateTurnoDto, comercioId: number): Promise<{
        comercio_id: number;
        estado: string;
        empleado_id: number;
        cliente_id: number;
        servicio_id: number;
        fecha_hora: Date;
        turno_id: number;
    }>;
    findAll(comercioId?: number): import("@prisma/client").Prisma.PrismaPromise<({
        cliente: {
            nombre: string;
            apellido: string;
            comercio_id: number;
            estado: string;
            telefono: string | null;
            email: string | null;
            cliente_id: number;
        };
        empleado: {
            nombre: string;
            apellido: string;
            comercio_id: number;
            estado: string;
            puesto: string | null;
            empleado_id: number;
        };
        servicio: {
            nombre: string;
            comercio_id: number;
            estado: string;
            descripcion: string | null;
            precio: number;
            duracion: number;
            servicio_id: number;
        };
    } & {
        comercio_id: number;
        estado: string;
        empleado_id: number;
        cliente_id: number;
        servicio_id: number;
        fecha_hora: Date;
        turno_id: number;
    })[]>;
    findOne(id: number, comercioId?: number): Promise<{
        cliente: {
            nombre: string;
            apellido: string;
            comercio_id: number;
            estado: string;
            telefono: string | null;
            email: string | null;
            cliente_id: number;
        };
        empleado: {
            nombre: string;
            apellido: string;
            comercio_id: number;
            estado: string;
            puesto: string | null;
            empleado_id: number;
        };
        servicio: {
            nombre: string;
            comercio_id: number;
            estado: string;
            descripcion: string | null;
            precio: number;
            duracion: number;
            servicio_id: number;
        };
    } & {
        comercio_id: number;
        estado: string;
        empleado_id: number;
        cliente_id: number;
        servicio_id: number;
        fecha_hora: Date;
        turno_id: number;
    }>;
    update(id: number, updateTurnoDto: UpdateTurnoDto, comercioId: number): Promise<{
        comercio_id: number;
        estado: string;
        empleado_id: number;
        cliente_id: number;
        servicio_id: number;
        fecha_hora: Date;
        turno_id: number;
    }>;
    remove(id: number, comercioId: number): Promise<{
        comercio_id: number;
        estado: string;
        empleado_id: number;
        cliente_id: number;
        servicio_id: number;
        fecha_hora: Date;
        turno_id: number;
    }>;
}
