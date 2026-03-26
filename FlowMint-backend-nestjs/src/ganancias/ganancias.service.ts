import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GananciasService {
  constructor(private prisma: PrismaService) {}

  private adjustDate(d: Date | string, isEnd: boolean): Date {
    const date = new Date(d);
    // Extraer componentes UTC para tratarlos como locales
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    if (isEnd) return new Date(year, month, day, 23, 59, 59, 999);
    return new Date(year, month, day, 0, 0, 0, 0);
  }

  async getGananciasDiarias(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: {
          gte: startLocal,
          lte: endLocal,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    const gananciasPorFecha = turnos.reduce((acc, turno) => {
      const fecha = turno.fecha_hora.toISOString().split('T')[0];
      if (!acc[fecha]) {
        acc[fecha] = { fecha: new Date(fecha), total: 0 };
      }
      acc[fecha].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorFecha)
      .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }

  async getGananciasSemanales(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: {
          gte: startLocal,
          lte: endLocal,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

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
    }, {});

    return Object.values(gananciasPorSemana)
      .sort((a: any, b: any) => (a.año - b.año) * 100 + (a.semana - b.semana));
  }

  async getGananciasMensuales(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: {
          gte: startLocal,
          lte: endLocal,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    const gananciasPorMes = turnos.reduce((acc, turno) => {
      const fecha = new Date(turno.fecha_hora);
      const mesKey = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!acc[mesKey]) {
        acc[mesKey] = { año: fecha.getFullYear(), mes: fecha.getMonth() + 1, total: 0 };
      }
      acc[mesKey].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorMes)
      .sort((a: any, b: any) => (a.año - b.año) * 100 + (a.mes - b.mes));
  }

  async getGananciasAnuales(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: {
          gte: startLocal,
          lte: endLocal,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: {
        servicio: true,
      },
    });

    const gananciasPorAnio = turnos.reduce((acc, turno) => {
      const anio = new Date(turno.fecha_hora).getFullYear();
      if (!acc[anio]) { acc[anio] = { año: anio, total: 0 }; }
      acc[anio].total += turno.servicio.precio;
      return acc;
    }, {});

    return Object.values(gananciasPorAnio).sort((a: any, b: any) => a.año - b.año);
  }

  async getGananciasMensualesPorServicio(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: {
          gte: startLocal,
          lte: endLocal,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: { servicio: true },
    });

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
    }, {});

    return Object.values(gananciasPorMesServicio).sort((a: any, b: any) => 
        (a.año - b.año) * 100 + (a.mes - b.mes) || (a.servicio_id - b.servicio_id)
      );
  }

  async getGananciasMensualesPorEmpleado(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: {
          gte: startLocal,
          lte: endLocal,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: { servicio: true, empleado: true },
    });

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
    }, {});

    return Object.values(gananciasPorMesEmpleado).sort((a: any, b: any) => 
        (a.año - b.año) * 100 + (a.mes - b.mes) || (a.empleado_id - b.empleado_id)
      );
  }

  async getResumenGanancias(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : new Date(new Date().setHours(0,0,0,0));
    const endLocal = endDate ? this.adjustDate(endDate, true) : new Date(new Date().setHours(23,59,59,999));

    // Obtener turnos confirmados
    const turnosConfirmados = await this.prisma.turno.findMany({
      where: {
        estado: 'confirmado',
        ...(comercioId && { comercio_id: comercioId }),
        fecha_hora: { 
          gte: startLocal, 
          lte: endLocal 
        },
      },
      include: { servicio: true },
    });

    // Obtener turnos pendientes
    const turnosPendientes = await this.prisma.turno.findMany({
      where: {
        estado: 'pendiente',
        ...(comercioId && { comercio_id: comercioId }),
        fecha_hora: { 
          gte: startLocal, 
          lte: endLocal 
        },
      },
      include: { servicio: true },
    });

    const totalConfirmado = turnosConfirmados.reduce((sum, turno) => sum + (turno.servicio?.precio || 0), 0);
    const totalPendiente = turnosPendientes.reduce((sum, turno) => sum + (turno.servicio?.precio || 0), 0);
    
    // Calcular días para el promedio
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
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: {
          gte: startLocal,
          lte: endLocal,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: { servicio: true },
    });

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
    }, {});

    return Object.values(gananciasPorAnioServicio).sort((a: any, b: any) => 
      a.año - b.año || (a.servicio_id - b.servicio_id)
    );
  }

  async getGananciasAnualesPorEmpleado(comercioId?: number, startDate?: Date, endDate?: Date) {
    const startLocal = startDate ? this.adjustDate(startDate, false) : undefined;
    const endLocal = endDate ? this.adjustDate(endDate, true) : undefined;

    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startLocal && endLocal && {
        fecha_hora: {
          gte: startLocal,
          lte: endLocal,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: { servicio: true, empleado: true },
    });

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
    }, {});

    return Object.values(gananciasPorAnioEmpleado).sort((a: any, b: any) => 
      a.año - b.año || (a.empleado_id - b.empleado_id)
    );
  }
}
