import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComerciosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.comercio.findMany({
      include: {
        _count: {
          select: { usuarios: true, clientes: true, turnos: true, empleados: true, servicios: true }
        }
      },
      orderBy: { creado_en: 'desc' }
    });
  }

  findOne(id: number) {
    return this.prisma.comercio.findUnique({
      where: { comercio_id: id },
      include: { usuarios: true }
    });
  }

  create(data: any) {
    if (data.activo !== undefined && !data.estado) {
      data.estado = data.activo ? 'activo' : 'pendiente';
    }
    return this.prisma.comercio.create({ data });
  }

  async update(id: number, data: any) {
    if (data.activo !== undefined) {
      if (data.activo === true) {
        data.estado = 'activo';
        data.fecha_activacion = new Date();
        data.fecha_suspension = null;
        data.motivo_suspension = null;
      } else {
        data.estado = 'suspendido';
        data.fecha_suspension = new Date();
      }
    }
    
    return this.prisma.comercio.update({
      where: { comercio_id: id },
      data
    });
  }

  async remove(id: number) {
    await this.prisma.turno.deleteMany({ where: { comercio_id: id } });
    await this.prisma.servicio.deleteMany({ where: { comercio_id: id } });
    await this.prisma.empleado.deleteMany({ where: { comercio_id: id } });
    await this.prisma.cliente.deleteMany({ where: { comercio_id: id } });
    await this.prisma.usuario.deleteMany({ where: { comercio_id: id } });

    return this.prisma.comercio.delete({
      where: { comercio_id: id }
    });
  }
}
