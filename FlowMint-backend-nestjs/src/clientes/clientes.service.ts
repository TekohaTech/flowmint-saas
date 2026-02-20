import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  create(createClienteDto: CreateClienteDto, comercioId: number) {
    return this.prisma.cliente.create({
      data: {
        ...createClienteDto,
        comercio_id: comercioId,
      },
    });
  }

  findAll(comercioId?: number) {
    // Si no hay comercioId (SuperAdmin), devuelve todos. Si hay, filtra.
    const where = comercioId ? { comercio_id: comercioId, estado: 'A' } : { estado: 'A' };
    return this.prisma.cliente.findMany({ where });
  }

  async findOne(id: number, comercioId?: number) {
    const where = comercioId ? { cliente_id: id, comercio_id: comercioId } : { cliente_id: id };
    const cliente = await this.prisma.cliente.findFirst({ where });
    
    if (!cliente || cliente.estado === 'B') {
      throw new NotFoundException(`Cliente #${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto, comercioId?: number) {
    await this.findOne(id, comercioId); // Valida que exista y pertenezca al comercio
    return this.prisma.cliente.update({
      where: { cliente_id: id },
      data: updateClienteDto,
    });
  }

  async remove(id: number, comercioId?: number) {
    await this.findOne(id, comercioId);
    // Borrado lógico
    return this.prisma.cliente.update({
      where: { cliente_id: id },
      data: { estado: 'B' },
    });
  }
}
