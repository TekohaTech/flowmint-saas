import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TurnosService {
  constructor(private prisma: PrismaService) {}

  private async checkAvailability(
    empleado_id: number,
    fecha_hora: Date,
    servicio_id: number,
    comercio_id: number,
    turno_id?: number,
  ) {
    const servicio = await this.prisma.servicio.findFirst({
      where: { servicio_id, comercio_id },
    });
    if (!servicio) {
      throw new ConflictException('El servicio especificado no existe o no pertenece a tu comercio.');
    }

    const newTurnoStartTime = new Date(fecha_hora);
    const newTurnoEndTime = new Date(
      newTurnoStartTime.getTime() + servicio.duracion * 60000,
    );

    const dayStart = new Date(newTurnoStartTime);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(newTurnoStartTime);
    dayEnd.setHours(23, 59, 59, 999);

    const turnosDelDia = await this.prisma.turno.findMany({
      where: {
        empleado_id,
        comercio_id,
        estado: { not: 'cancelado' },
        turno_id: { not: turno_id },
        fecha_hora: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      include: {
        servicio: true,
      },
    });
    
    for (const turno of turnosDelDia) {
      const existingStartTime = new Date(turno.fecha_hora);
      const existingEndTime = new Date(
        existingStartTime.getTime() + turno.servicio.duracion * 60000,
      );

      if (
        existingStartTime < newTurnoEndTime &&
        existingEndTime > newTurnoStartTime
      ) {
        throw new ConflictException(
          `El empleado ya tiene un turno programado (${
            turno.servicio.nombre
          }) que se superpone con este horario.`,
        );
      }
    }
  }

  async create(createTurnoDto: CreateTurnoDto, comercioId: number) {
    await this.checkAvailability(
      createTurnoDto.empleado_id,
      createTurnoDto.fecha_hora,
      createTurnoDto.servicio_id,
      comercioId,
    );
    return this.prisma.turno.create({
      data: {
        ...createTurnoDto,
        comercio_id: comercioId,
      },
    });
  }

  findAll(comercioId?: number) {
    const where = comercioId ? { comercio_id: comercioId } : {};
    return this.prisma.turno.findMany({
      where,
      include: {
        cliente: true,
        empleado: true,
        servicio: true,
      },
    });
  }

  async findOne(id: number, comercioId?: number) {
    const where = comercioId ? { turno_id: id, comercio_id: comercioId } : { turno_id: id };
    const turno = await this.prisma.turno.findFirst({
      where,
      include: {
        cliente: true,
        empleado: true,
        servicio: true,
      },
    });
    if (!turno) throw new NotFoundException(`Turno #${id} no encontrado`);
    return turno;
  }

  async update(id: number, updateTurnoDto: UpdateTurnoDto, comercioId: number) {
    const turnoActual = await this.findOne(id, comercioId);

    const empleado_id = updateTurnoDto.empleado_id ?? turnoActual.empleado_id;
    const fecha_hora = updateTurnoDto.fecha_hora ?? turnoActual.fecha_hora;
    const servicio_id = updateTurnoDto.servicio_id ?? turnoActual.servicio_id;

    await this.checkAvailability(
      empleado_id,
      fecha_hora,
      servicio_id,
      comercioId,
      id,
    );

    return this.prisma.turno.update({
      where: { turno_id: id },
      data: updateTurnoDto,
    });
  }

  async remove(id: number, comercioId: number) {
    await this.findOne(id, comercioId);
    return this.prisma.turno.delete({ where: { turno_id: id } });
  }
}
