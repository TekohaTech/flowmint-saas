import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateComercioDto } from './dto/create-comercio.dto';
import { UpdateComercioDto } from './dto/update-comercio.dto';

@Injectable()
export class ComerciosService {
  private readonly logger = new Logger(ComerciosService.name);

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

  create(dto: CreateComercioDto) {
    return this.prisma.comercio.create({
      data: {
        nombre: dto.nombre,
        ...(dto.direccion && { direccion: dto.direccion }),
        ...(dto.telefono && { telefono: dto.telefono }),
        ...(dto.email && { email: dto.email }),
        ...(dto.categoria && { categoria: dto.categoria }),
        ...(dto.logo_url && { logo_url: dto.logo_url }),
        ...(dto.dueno_nombre && { dueno_nombre: dto.dueno_nombre }),
        ...(dto.dueno_apellido && { dueno_apellido: dto.dueno_apellido }),
        ...(dto.dueno_email && { dueno_email: dto.dueno_email }),
        ...(dto.dueno_telefono && { dueno_telefono: dto.dueno_telefono }),
        activo: dto.activo ?? false,
        estado: dto.activo ? 'activo' : 'pendiente',
      },
    });
  }

  async update(id: number, dto: UpdateComercioDto) {
    const updateData: Record<string, unknown> = {};

    if (dto.nombre !== undefined) updateData.nombre = dto.nombre;
    if (dto.direccion !== undefined) updateData.direccion = dto.direccion;
    if (dto.telefono !== undefined) updateData.telefono = dto.telefono;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.categoria !== undefined) updateData.categoria = dto.categoria;
    if (dto.logo_url !== undefined) updateData.logo_url = dto.logo_url;
    if (dto.dueno_nombre !== undefined) updateData.dueno_nombre = dto.dueno_nombre;
    if (dto.dueno_apellido !== undefined) updateData.dueno_apellido = dto.dueno_apellido;
    if (dto.dueno_email !== undefined) updateData.dueno_email = dto.dueno_email;
    if (dto.dueno_telefono !== undefined) updateData.dueno_telefono = dto.dueno_telefono;

    if (dto.activo !== undefined) {
      // Persist the boolean flag too — the login gate reads comercio.activo,
      // so without this the toggle left the row inconsistent (estado=activo
      // but activo=false), blocking DUENO/EMPLEADO logins forever.
      updateData.activo = dto.activo;
      if (dto.activo === true) {
        updateData.estado = 'activo';
        updateData.fecha_activacion = new Date();
        updateData.fecha_suspension = null;
        updateData.motivo_suspension = null;
      } else {
        updateData.estado = 'suspendido';
        updateData.fecha_suspension = new Date();
      }
    }

    if (dto.estado !== undefined) updateData.estado = dto.estado;
    if (dto.motivo_suspension !== undefined) updateData.motivo_suspension = dto.motivo_suspension;

    return this.prisma.comercio.update({
      where: { comercio_id: id },
      data: updateData,
    });
  }

  async remove(id: number) {
    // Delete related records in a transaction to prevent partial deletion
    return this.prisma.$transaction(async (tx) => {
      await tx.turno.deleteMany({ where: { comercio_id: id } });
      await tx.servicio.deleteMany({ where: { comercio_id: id } });
      await tx.empleado.deleteMany({ where: { comercio_id: id } });
      await tx.cliente.deleteMany({ where: { comercio_id: id } });
      await tx.usuario.deleteMany({ where: { comercio_id: id } });

      this.logger.log(`Comercio ${id} and all related records deleted`);

      return tx.comercio.delete({
        where: { comercio_id: id }
      });
    });
  }
}
