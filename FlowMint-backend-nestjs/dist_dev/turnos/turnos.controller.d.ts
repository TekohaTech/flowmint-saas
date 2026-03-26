import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
export declare class TurnosController {
    private readonly turnosService;
    constructor(turnosService: TurnosService);
    create(createTurnoDto: CreateTurnoDto, req: any): Promise<{
        comercio_id: number;
        estado: string;
        empleado_id: number;
        cliente_id: number;
        servicio_id: number;
        fecha_hora: Date;
        turno_id: number;
    }>;
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<({
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
    findOne(id: number, req: any): Promise<{
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
    update(id: number, updateTurnoDto: UpdateTurnoDto, req: any): Promise<{
        comercio_id: number;
        estado: string;
        empleado_id: number;
        cliente_id: number;
        servicio_id: number;
        fecha_hora: Date;
        turno_id: number;
    }>;
    remove(id: number, req: any): Promise<{
        comercio_id: number;
        estado: string;
        empleado_id: number;
        cliente_id: number;
        servicio_id: number;
        fecha_hora: Date;
        turno_id: number;
    }>;
}
