import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GananciasService {
  constructor(private prisma: PrismaService) {}

  async getGananciasDiarias(comercioId?: number, startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
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
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
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
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
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
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
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
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
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
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
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
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
        },
      }),
    };

    const turnos = await this.prisma.turno.findMany({
      where: whereClause,
      include: { servicio: true },
    });

    const total = turnos.reduce((sum, turno) => sum + turno.servicio.precio, 0);
    const promedioPorDia = turnos.length > 0 ? total / (endDate && startDate 
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1 
      : 1) : 0;
    
    return {
      total,
      totalTurnos: turnos.length,
      promedioPorDia,
    };
  }

  async getGananciasAnualesPorServicio(comercioId?: number, startDate?: Date, endDate?: Date) {
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
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
    const whereClause = {
      estado: 'confirmado',
      ...(comercioId && { comercio_id: comercioId }),
      ...(startDate && endDate && {
        fecha_hora: {
          gte: startDate,
          lte: endDate,
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
