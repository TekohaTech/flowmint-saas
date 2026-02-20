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
    return this.prisma.comercio.create({ data });
  }

  update(id: number, data: any) {
    return this.prisma.comercio.update({
      where: { comercio_id: id },
      data
    });
  }

  async remove(id: number) {
    // 1. Delete all related entities first (Manual cascade if not set in DB)
    await this.prisma.turno.deleteMany({ where: { comercio_id: id } });
    await this.prisma.servicio.deleteMany({ where: { comercio_id: id } });
    await this.prisma.empleado.deleteMany({ where: { comercio_id: id } });
    await this.prisma.cliente.deleteMany({ where: { comercio_id: id } });
    await this.prisma.usuario.deleteMany({ where: { comercio_id: id } });

    // 2. Finally delete the commerce
    return this.prisma.comercio.delete({
      where: { comercio_id: id }
    });
  }
}
