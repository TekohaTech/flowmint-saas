import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) {}

  create(createServicioDto: CreateServicioDto, comercioId: number) {
    return this.prisma.servicio.create({
      data: {
        ...createServicioDto,
        comercio_id: comercioId,
      },
    });
  }

  findAll(comercioId?: number) {
    const where = comercioId ? { comercio_id: comercioId, estado: 'A' } : { estado: 'A' };
    return this.prisma.servicio.findMany({ where });
  }

  async findOne(id: number, comercioId?: number) {
    const where = comercioId ? { servicio_id: id, comercio_id: comercioId } : { servicio_id: id };
    const servicio = await this.prisma.servicio.findFirst({ where });
    
    if (!servicio || servicio.estado === 'B') {
      throw new NotFoundException(`Servicio #${id} no encontrado`);
    }
    return servicio;
  }

  async update(id: number, updateServicioDto: UpdateServicioDto, comercioId?: number) {
    await this.findOne(id, comercioId);
    return this.prisma.servicio.update({
      where: { servicio_id: id },
      data: updateServicioDto,
    });
  }

  async remove(id: number, comercioId?: number) {
    await this.findOne(id, comercioId);
    return this.prisma.servicio.update({
      where: { servicio_id: id },
      data: { estado: 'B' },
    });
  }
}
