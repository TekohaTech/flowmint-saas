import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) {}

  create(createEmpleadoDto: CreateEmpleadoDto, comercioId: number) {
    return this.prisma.empleado.create({
      data: {
        ...createEmpleadoDto,
        comercio_id: comercioId,
      },
    });
  }

  findAll(comercioId?: number) {
    const where = comercioId ? { comercio_id: comercioId, estado: 'A' } : { estado: 'A' };
    return this.prisma.empleado.findMany({ where });
  }

  async findOne(id: number, comercioId?: number) {
    const where = comercioId ? { empleado_id: id, comercio_id: comercioId } : { empleado_id: id };
    const empleado = await this.prisma.empleado.findFirst({ where });
    
    if (!empleado || empleado.estado === 'B') {
      throw new NotFoundException(`Empleado #${id} no encontrado`);
    }
    return empleado;
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto, comercioId?: number) {
    await this.findOne(id, comercioId);
    return this.prisma.empleado.update({
      where: { empleado_id: id },
      data: updateEmpleadoDto,
    });
  }

  async remove(id: number, comercioId?: number) {
    await this.findOne(id, comercioId);
    return this.prisma.empleado.update({
      where: { empleado_id: id },
      data: { estado: 'B' },
    });
  }
}
