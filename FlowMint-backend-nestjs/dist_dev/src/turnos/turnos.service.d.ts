import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class TurnosService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkAvailability;
    create(createTurnoDto: CreateTurnoDto, comercioId: number): Promise<{
        estado: string;
        comercio_id: number;
        cliente_id: number;
        empleado_id: number;
        servicio_id: number;
        turno_id: number;
        fecha_hora: Date;
    }>;
    findAll(comercioId?: number): import("@prisma/client").Prisma.PrismaPromise<({
        cliente: {
            nombre: string;
            apellido: string;
            estado: string;
            comercio_id: number;
            telefono: string | null;
            email: string | null;
            cliente_id: number;
        };
        empleado: {
            nombre: string;
            apellido: string;
            estado: string;
            comercio_id: number;
            puesto: string | null;
            empleado_id: number;
        };
        servicio: {
            nombre: string;
            estado: string;
            comercio_id: number;
            descripcion: string | null;
            precio: number;
            duracion: number;
            servicio_id: number;
        };
    } & {
        estado: string;
        comercio_id: number;
        cliente_id: number;
        empleado_id: number;
        servicio_id: number;
        turno_id: number;
        fecha_hora: Date;
    })[]>;
    findOne(id: number, comercioId?: number): Promise<{
        cliente: {
            nombre: string;
            apellido: string;
            estado: string;
            comercio_id: number;
            telefono: string | null;
            email: string | null;
            cliente_id: number;
        };
        empleado: {
            nombre: string;
            apellido: string;
            estado: string;
            comercio_id: number;
            puesto: string | null;
            empleado_id: number;
        };
        servicio: {
            nombre: string;
            estado: string;
            comercio_id: number;
            descripcion: string | null;
            precio: number;
            duracion: number;
            servicio_id: number;
        };
    } & {
        estado: string;
        comercio_id: number;
        cliente_id: number;
        empleado_id: number;
        servicio_id: number;
        turno_id: number;
        fecha_hora: Date;
    }>;
    update(id: number, updateTurnoDto: UpdateTurnoDto, comercioId: number): Promise<{
        estado: string;
        comercio_id: number;
        cliente_id: number;
        empleado_id: number;
        servicio_id: number;
        turno_id: number;
        fecha_hora: Date;
    }>;
    remove(id: number, comercioId: number): Promise<{
        estado: string;
        comercio_id: number;
        cliente_id: number;
        empleado_id: number;
        servicio_id: number;
        turno_id: number;
        fecha_hora: Date;
    }>;
}
