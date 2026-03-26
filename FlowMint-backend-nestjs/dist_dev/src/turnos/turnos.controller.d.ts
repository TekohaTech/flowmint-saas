import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
export declare class TurnosController {
    private readonly turnosService;
    constructor(turnosService: TurnosService);
    create(createTurnoDto: CreateTurnoDto, req: any): Promise<{
        estado: string;
        comercio_id: number;
        cliente_id: number;
        empleado_id: number;
        servicio_id: number;
        turno_id: number;
        fecha_hora: Date;
    }>;
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: number, req: any): Promise<{
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
    update(id: number, updateTurnoDto: UpdateTurnoDto, req: any): Promise<{
        estado: string;
        comercio_id: number;
        cliente_id: number;
        empleado_id: number;
        servicio_id: number;
        turno_id: number;
        fecha_hora: Date;
    }>;
    remove(id: number, req: any): Promise<{
        estado: string;
        comercio_id: number;
        cliente_id: number;
        empleado_id: number;
        servicio_id: number;
        turno_id: number;
        fecha_hora: Date;
    }>;
}
