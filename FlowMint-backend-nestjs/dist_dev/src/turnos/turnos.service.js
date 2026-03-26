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
exports.TurnosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TurnosService = class TurnosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAvailability(empleado_id, fecha_hora, servicio_id, comercio_id, turno_id) {
        const servicio = await this.prisma.servicio.findFirst({
            where: { servicio_id, comercio_id },
        });
        if (!servicio) {
            throw new common_1.ConflictException('El servicio especificado no existe o no pertenece a tu comercio.');
        }
        const newTurnoStartTime = new Date(fecha_hora);
        const newTurnoEndTime = new Date(newTurnoStartTime.getTime() + servicio.duracion * 60000);
        const dayStart = new Date(newTurnoStartTime);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(newTurnoStartTime);
        dayEnd.setHours(23, 59, 59, 999);
        const turnosDelDia = await this.prisma.turno.findMany({
            where: {
                empleado_id,
                comercio_id,
                estado: { not: 'cancelado' },
                turno_id: { not: turno_id },
                fecha_hora: {
                    gte: dayStart,
                    lte: dayEnd,
                },
            },
            include: {
                servicio: true,
            },
        });
        for (const turno of turnosDelDia) {
            const existingStartTime = new Date(turno.fecha_hora);
            const existingEndTime = new Date(existingStartTime.getTime() + turno.servicio.duracion * 60000);
            if (existingStartTime < newTurnoEndTime &&
                existingEndTime > newTurnoStartTime) {
                throw new common_1.ConflictException(`El empleado ya tiene un turno programado (${turno.servicio.nombre}) que se superpone con este horario.`);
            }
        }
    }
    async create(createTurnoDto, comercioId) {
        await this.checkAvailability(createTurnoDto.empleado_id, createTurnoDto.fecha_hora, createTurnoDto.servicio_id, comercioId);
        return this.prisma.turno.create({
            data: {
                ...createTurnoDto,
                comercio_id: comercioId,
            },
        });
    }
    findAll(comercioId) {
        const where = comercioId ? { comercio_id: comercioId } : {};
        return this.prisma.turno.findMany({
            where,
            include: {
                cliente: true,
                empleado: true,
                servicio: true,
            },
        });
    }
    async findOne(id, comercioId) {
        const where = comercioId ? { turno_id: id, comercio_id: comercioId } : { turno_id: id };
        const turno = await this.prisma.turno.findFirst({
            where,
            include: {
                cliente: true,
                empleado: true,
                servicio: true,
            },
        });
        if (!turno)
            throw new common_1.NotFoundException(`Turno #${id} no encontrado`);
        return turno;
    }
    async update(id, updateTurnoDto, comercioId) {
        const turnoActual = await this.findOne(id, comercioId);
        const empleado_id = updateTurnoDto.empleado_id ?? turnoActual.empleado_id;
        const fecha_hora = updateTurnoDto.fecha_hora ?? turnoActual.fecha_hora;
        const servicio_id = updateTurnoDto.servicio_id ?? turnoActual.servicio_id;
        await this.checkAvailability(empleado_id, fecha_hora, servicio_id, comercioId, id);
        return this.prisma.turno.update({
            where: { turno_id: id },
            data: updateTurnoDto,
        });
    }
    async remove(id, comercioId) {
        await this.findOne(id, comercioId);
        return this.prisma.turno.delete({ where: { turno_id: id } });
    }
};
exports.TurnosService = TurnosService;
exports.TurnosService = TurnosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TurnosService);
//# sourceMappingURL=turnos.service.js.map