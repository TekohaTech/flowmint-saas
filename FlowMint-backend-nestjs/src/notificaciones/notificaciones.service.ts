import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';

const MAX_NOTIFICACIONES_POR_USUARIO = 50;
const DIAS_RETENCION_LEIDAS = 30;
const DIAS_RETENCION_NO_LEIDAS = 90;

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificacionDto, user: any) {
    const creadorId = user.usuario_id;
    const rolNombre = user.rol?.nombre || user.rol;
    const comercioId = rolNombre === 'SUPERADMIN' ? null : user.comercio_id;

    if (!dto.target_all && !dto.target_user_id) {
      throw new BadRequestException('Debe especificar target_user_id o target_all');
    }

    if (dto.target_all && dto.target_user_id) {
      throw new BadRequestException('No puede especificar target_user_id y target_all al mismo tiempo');
    }

    // Limitar mensaje a 500 chars
    if (dto.mensaje.length > 500) {
      dto.mensaje = dto.mensaje.substring(0, 500);
    }

    if (dto.target_all) {
      const where: any = { estado: 'A' };
      if (comercioId) {
        where.comercio_id = comercioId;
      }

      const users = await this.prisma.usuario.findMany({
        where,
        select: { usuario_id: true },
      });

      if (users.length === 0) {
        return { count: 0 };
      }

      const notifications = users.map((u) => ({
        usuario_id: u.usuario_id,
        comercio_id: comercioId,
        target_all: true,
        tipo: dto.tipo || 'info',
        titulo: dto.titulo,
        mensaje: dto.mensaje,
        creado_por: creadorId,
      }));

      await this.prisma.notificacion.createMany({ data: notifications });

      // Cleanup después de crear (fire and forget)
      this.cleanupOldNotifications().catch((err) =>
        this.logger.warn(`Cleanup failed: ${err.message}`),
      );

      return { count: notifications.length };
    }

    // Notificación a usuario específico
    const targetUser = await this.prisma.usuario.findUnique({
      where: { usuario_id: dto.target_user_id },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuario destino no encontrado');
    }

    if (rolNombre !== 'SUPERADMIN' && targetUser.comercio_id !== user.comercio_id) {
      throw new ForbiddenException('No puede enviar notificaciones a usuarios de otro comercio');
    }

    await this.prisma.notificacion.create({
      data: {
        usuario_id: dto.target_user_id!,
        comercio_id: comercioId,
        tipo: dto.tipo || 'info',
        titulo: dto.titulo,
        mensaje: dto.mensaje,
        creado_por: creadorId,
      },
    });

    // Cleanup después de crear
    this.cleanupOldNotifications().catch((err) =>
      this.logger.warn(`Cleanup failed: ${err.message}`),
    );

    return { count: 1 };
  }

  async findByUser(user: any, unreadOnly = false) {
    const where: any = { usuario_id: user.usuario_id };
    if (unreadOnly) {
      where.leido = false;
    }

    return this.prisma.notificacion.findMany({
      where,
      orderBy: [{ leido: 'asc' }, { creado_en: 'desc' }],
      take: 50,
      select: {
        notificacion_id: true,
        titulo: true,
        mensaje: true,
        tipo: true,
        leido: true,
        creado_en: true,
        creado_por: true,
      },
    });
  }

  async getUnreadCount(user: any) {
    const count = await this.prisma.notificacion.count({
      where: {
        usuario_id: user.usuario_id,
        leido: false,
      },
    });
    return { count };
  }

  async markAsRead(id: number, user: any) {
    const notification = await this.prisma.notificacion.findUnique({
      where: { notificacion_id: id },
    });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    if (notification.usuario_id !== user.usuario_id) {
      throw new ForbiddenException('No autorizado para marcar esta notificación');
    }

    return this.prisma.notificacion.update({
      where: { notificacion_id: id },
      data: { leido: true },
      select: {
        notificacion_id: true,
        titulo: true,
        mensaje: true,
        tipo: true,
        leido: true,
        creado_en: true,
      },
    });
  }

  /**
   * Auto-cleanup: elimina notificaciones viejas para no ocupar espacio.
   * - Leídas: delete after 30 days
   * - No leídas: delete after 90 days
   * - Additionally, per user: keep max 50, delete oldest leídas first
   */
  async cleanupOldNotifications() {
    const now = new Date();

    // 1. Delete leídas > 30 días
    const cutoffLeidas = new Date(now);
    cutoffLeidas.setDate(cutoffLeidas.getDate() - DIAS_RETENCION_LEIDAS);

    const deletedLeidas = await this.prisma.notificacion.deleteMany({
      where: {
        leido: true,
        creado_en: { lt: cutoffLeidas },
      },
    });

    // 2. Delete no leídas > 90 días
    const cutoffNoLeidas = new Date(now);
    cutoffNoLeidas.setDate(cutoffNoLeidas.getDate() - DIAS_RETENCION_NO_LEIDAS);

    const deletedNoLeidas = await this.prisma.notificacion.deleteMany({
      where: {
        leido: false,
        creado_en: { lt: cutoffNoLeidas },
      },
    });

    // 3. Per user: keep max 50 (delete oldest leídas first, then oldest overall)
    const usersWithTooMany = await this.prisma.$queryRaw<{ usuario_id: number; cnt: bigint }[]>`
      SELECT usuario_id, COUNT(*) as cnt
      FROM "Notificacion"
      GROUP BY usuario_id
      HAVING COUNT(*) > ${MAX_NOTIFICACIONES_POR_USUARIO}
    `;

    for (const row of usersWithTooMany) {
      const uid = row.usuario_id;
      const excess = Number(row.cnt) - MAX_NOTIFICACIONES_POR_USUARIO;

      // Delete oldest leídas first
      const oldestLeidas = await this.prisma.notificacion.findMany({
        where: { usuario_id: uid, leido: true },
        orderBy: { creado_en: 'asc' },
        take: excess,
        select: { notificacion_id: true },
      });

      let deleted = 0;
      if (oldestLeidas.length > 0) {
        const res = await this.prisma.notificacion.deleteMany({
          where: { notificacion_id: { in: oldestLeidas.map((n) => n.notificacion_id) } },
        });
        deleted = res.count;
      }

      // If still over limit, delete oldest overall (even unread)
      const remaining = excess - deleted;
      if (remaining > 0) {
        const oldestOverall = await this.prisma.notificacion.findMany({
          where: { usuario_id: uid },
          orderBy: { creado_en: 'asc' },
          take: remaining,
          select: { notificacion_id: true },
        });
        if (oldestOverall.length > 0) {
          await this.prisma.notificacion.deleteMany({
            where: { notificacion_id: { in: oldestOverall.map((n) => n.notificacion_id) } },
          });
        }
      }
    }

    const total = deletedLeidas.count + deletedNoLeidas.count;
    if (total > 0) {
      this.logger.log(`Cleanup: ${total} notificaciones antiguas eliminadas`);
    }
  }
}
