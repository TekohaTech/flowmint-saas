"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GananciasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GananciasService = class GananciasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGananciasDiarias(comercioId, startDate, endDate) {
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
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    }
    async getGananciasSemanales(comercioId, startDate, endDate) {
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
            .sort((a, b) => (a.año - b.año) * 100 + (a.semana - b.semana));
    }
    async getGananciasMensuales(comercioId, startDate, endDate) {
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
            .sort((a, b) => (a.año - b.año) * 100 + (a.mes - b.mes));
    }
    async getGananciasAnuales(comercioId, startDate, endDate) {
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
            if (!acc[anio]) {
                acc[anio] = { año: anio, total: 0 };
            }
            acc[anio].total += turno.servicio.precio;
            return acc;
        }, {});
        return Object.values(gananciasPorAnio).sort((a, b) => a.año - b.año);
    }
    async getGananciasMensualesPorServicio(comercioId, startDate, endDate) {
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
        return Object.values(gananciasPorMesServicio).sort((a, b) => (a.año - b.año) * 100 + (a.mes - b.mes) || (a.servicio_id - b.servicio_id));
    }
    async getGananciasMensualesPorEmpleado(comercioId, startDate, endDate) {
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
        return Object.values(gananciasPorMesEmpleado).sort((a, b) => (a.año - b.año) * 100 + (a.mes - b.mes) || (a.empleado_id - b.empleado_id));
    }
    async getResumenGanancias(comercioId, startDate, endDate) {
        const turnosConfirmados = await this.prisma.turno.findMany({
            where: {
                estado: 'confirmado',
                ...(comercioId && { comercio_id: comercioId }),
                ...(startDate && endDate && {
                    fecha_hora: { gte: startDate, lte: endDate },
                }),
            },
            include: { servicio: true },
        });
        const turnosPendientes = await this.prisma.turno.findMany({
            where: {
                estado: 'pendiente',
                ...(comercioId && { comercio_id: comercioId }),
                ...(startDate && endDate && {
                    fecha_hora: { gte: startDate, lte: endDate },
                }),
            },
            include: { servicio: true },
        });
        const totalConfirmado = turnosConfirmados.reduce((sum, turno) => sum + (turno.servicio?.precio || 0), 0);
        const totalPendiente = turnosPendientes.reduce((sum, turno) => sum + (turno.servicio?.precio || 0), 0);
        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : new Date();
        const msPerDay = 1000 * 60 * 60 * 24;
        const dias = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / msPerDay));
        return {
            total: totalConfirmado,
            totalPendiente,
            totalProyectado: totalConfirmado + totalPendiente,
            totalTurnos: turnosConfirmados.length,
            totalTurnosPendientes: turnosPendientes.length,
            promedioPorDia: totalConfirmado / dias,
        };
    }
    async getGananciasAnualesPorServicio(comercioId, startDate, endDate) {
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
        return Object.values(gananciasPorAnioServicio).sort((a, b) => a.año - b.año || (a.servicio_id - b.servicio_id));
    }
    async getGananciasAnualesPorEmpleado(comercioId, startDate, endDate) {
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
        return Object.values(gananciasPorAnioEmpleado).sort((a, b) => a.año - b.año || (a.empleado_id - b.empleado_id));
    }
};
exports.GananciasService = GananciasService;
exports.GananciasService = GananciasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GananciasService);
//# sourceMappingURL=ganancias.service.js.map