import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GananciasService {
  constructor(private prisma: PrismaService) {}

  private adjustDate(d: Date | string, isEnd: boolean): Date {
    const date = new Date(d);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    if (isEnd) return new Date(year, month, day, 23, 59, 59, 999);
    return new Date(year, month, day, 0, 0, 0, 0);
  }

  private buildTurnoWhere(
    comercioId?: number,
    startDate?: Date,
    endDate?: Date,
    estado: string = 'confirmado',
  ): Prisma.TurnoWhereInput {
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    return {
      estado,
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: { gte: startLocal, lte: endLocal },
      }),
    };
  }

  private async getTurnos(
    comercioId?: number,
    startDate?: Date,
    endDate?: Date,
    include?: Prisma.TurnoInclude,
    estado: string = 'confirmado',
  ) {
    return this.prisma.turno.findMany({
      where: this.buildTurnoWhere(comercioId, startDate, endDate, estado),
      include: include ?? { servicio: true },
    });
  }

  async getGananciasDiarias(comercioId?: number, startDate?: Date, endDate?: Date) {
    const turnos = await this.getTurnos(comercioId, startDate, endDate);

    const gananciasPorFecha = turnos.reduce((acc, turno) => {
      const fecha = turno.fecha_hora.toISOString().split('T')[0];
      if (!acc[fecha]) {
        acc[fecha] = { fecha: new Date(fecha), total: 0 };
      }
      acc[fecha].total += turno.servicio.precio;
      return acc;
    }, {} as Record<string, { fecha: Date; total: number }>);

    return Object.values(gananciasPorFecha)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }

  async getGananciasSemanales(comercioId?: number, startDate?: Date, endDate?: Date) {
    const turnos = await this.getTurnos(comercioId, startDate, endDate);

    const gananciasPorSemana = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const primerDiaAnio = new Date(fecha.getFullYear(), 0, 1);
      const numeroSemana = Math.ceil(((fecha.getTime() - primerDiaAnio.getTime()) / 86400000 + primerDiaAnio.getDay() + 1) / 7);
      const semanaKey = `${fecha.getFullYear()}-W${numeroSemana.toString().padStart(2, '0')}`;

      if (!acc[semanaKey]) {
        acc[semanaKey] = { año: fecha.getFullYear(), semana: numeroSemana, total: 0 };
      }
      acc[semanaKey].total += turno.servicio.precio;
      return acc;
    }, {} as Record<string, { año: number; semana: number; total: number }>);

    return Object.values(gananciasPorSemana)
      .sort((a, b) => (a.año - b.año) * 100 + (a.semana - b.semana));
  }

  async getGananciasMensuales(comercioId?: number, startDate?: Date, endDate?: Date) {
    const turnos = await this.getTurnos(comercioId, startDate, endDate);

    const gananciasPorMes = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!acc[mesKey]) {
        acc[mesKey] = { año: fecha.getFullYear(), mes: fecha.getMonth() + 1, total: 0 };
      }
      acc[mesKey].total += turno.servicio.precio;
      return acc;
    }, {} as Record<string, { año: number; mes: number; total: number }>);

    return Object.values(gananciasPorMes)
      .sort((a, b) => (a.año - b.año) * 100 + (a.mes - b.mes));
  }

  async getGananciasAnuales(comercioId?: number, startDate?: Date, endDate?: Date) {
    const turnos = await this.getTurnos(comercioId, startDate, endDate);

    const gananciasPorAnio = turnos.reduce((acc, turno) => {
      const anio = new Date(turno.fecha_hora).getFullYear();
      if (!acc[anio]) { acc[anio] = { año: anio, total: 0 }; }
      acc[anio].total += turno.servicio.precio;
      return acc;
    }, {} as Record<string, { año: number; total: number }>);

    return Object.values(gananciasPorAnio).sort((a, b) => a.año - b.año);
  }

  async getGananciasMensualesPorServicio(comercioId?: number, startDate?: Date, endDate?: Date) {
    const turnos = await this.getTurnos(comercioId, startDate, endDate);

    const gananciasPorMesServicio = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      const key = `${mesKey}-${turno.servicio.servicio_id}`;

      if (!acc[key]) {
        acc[key] = {
          año: fecha.getFullYear(), mes: fecha.getMonth() + 1,
          servicio_id: turno.servicio.servicio_id, servicio: turno.servicio.nombre, total: 0
        };
      }
      acc[key].total += turno.servicio.precio;
      return acc;
    }, {} as Record<string, { año: number; mes: number; servicio_id: number; servicio: string; total: number }>);

    return Object.values(gananciasPorMesServicio).sort((a, b) =>
      (a.año - b.año) * 100 + (a.mes - b.mes) || (a.servicio_id - b.servicio_id)
    );
  }

  async getGananciasMensualesPorEmpleado(comercioId?: number, startDate?: Date, endDate?: Date) {
    const turnos = await this.getTurnos(comercioId, startDate, endDate, { servicio: true, empleado: true });

    const gananciasPorMesEmpleado = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      const key = `${mesKey}-${turno.empleado.empleado_id}`;

      if (!acc[key]) {
        acc[key] = {
          año: fecha.getFullYear(), mes: fecha.getMonth() + 1,
          empleado_id: turno.empleado.empleado_id, empleado: turno.empleado.nombre + ' ' + turno.empleado.apellido, total: 0
        };
      }
      acc[key].total += turno.servicio.precio;
      return acc;
    }, {} as Record<string, { año: number; mes: number; empleado_id: number; empleado: string; total: number }>);

    return Object.values(gananciasPorMesEmpleado).sort((a, b) =>
      (a.año - b.año) * 100 + (a.mes - b.mes) || (a.empleado_id - b.empleado_id)
    );
  }

  async getResumenGanancias(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : new Date(new Date().setHours(0, 0, 0, 0));
    const endLocal = endDate ? this.adjustDate(endDate, true) : new Date(new Date().setHours(23, 59, 59, 999));

    const [turnosConfirmados, turnosPendientes] = await Promise.all([
      this.getTurnos(comercioId, startDate, endDate, { servicio: true }, 'confirmado'),
      this.getTurnos(comercioId, startDate, endDate, { servicio: true }, 'pendiente'),
    ]);

    const totalConfirmado = turnosConfirmados.reduce((sum, turno) => sum + (turno.servicio?.precio || 0), 0);
    const totalPendiente = turnosPendientes.reduce((sum, turno) => sum + (turno.servicio?.precio || 0), 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const dias = Math.max(1, Math.ceil((endLocal.getTime() - startLocal.getTime()) / msPerDay));

    return {
      total: totalConfirmado,
      totalPendiente,
      totalProyectado: totalConfirmado + totalPendiente,
      totalTurnos: turnosConfirmados.length,
      totalTurnosPendientes: turnosPendientes.length,
      promedioPorDia: totalConfirmado / dias,
    };
  }

  async getGananciasAnualesPorServicio(comercioId?: number, startDate?: Date, endDate?: Date) {
    const turnos = await this.getTurnos(comercioId, startDate, endDate);

    const gananciasPorAnioServicio = turnos.reduce((acc, turno) => {
      const anio = new Date(turno.fecha_hora).getFullYear();
      const key = `${anio}-${turno.servicio.servicio_id}`;

      if (!acc[key]) {
        acc[key] = {
          año: anio,
          servicio_id: turno.servicio.servicio_id,
          servicio: turno.servicio.nombre,
          total: 0
        };
      }
      acc[key].total += turno.servicio.precio;
      return acc;
    }, {} as Record<string, { año: number; servicio_id: number; servicio: string; total: number }>);

    return Object.values(gananciasPorAnioServicio).sort((a, b) =>
      a.año - b.año || (a.servicio_id - b.servicio_id)
    );
  }

  async getGananciasAnualesPorEmpleado(comercioId?: number, startDate?: Date, endDate?: Date) {
    const turnos = await this.getTurnos(comercioId, startDate, endDate, { servicio: true, empleado: true });

    const gananciasPorAnioEmpleado = turnos.reduce((acc, turno) => {
      const anio = new Date(turno.fecha_hora).getFullYear();
      const key = `${anio}-${turno.empleado.empleado_id}`;

      if (!acc[key]) {
        acc[key] = {
          año: anio,
          empleado_id: turno.empleado.empleado_id,
          empleado: turno.empleado.nombre + ' ' + turno.empleado.apellido,
          total: 0
        };
      }
      acc[key].total += turno.servicio.precio;
      return acc;
    }, {} as Record<string, { año: number; empleado_id: number; empleado: string; total: number }>);

    return Object.values(gananciasPorAnioEmpleado).sort((a, b) =>
      a.año - b.año || (a.empleado_id - b.empleado_id)
    );
  }
}
