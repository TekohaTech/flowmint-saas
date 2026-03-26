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
exports.ComerciosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ComerciosService = class ComerciosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    findOne(id) {
        return this.prisma.comercio.findUnique({
            where: { comercio_id: id },
            include: { usuarios: true }
        });
    }
    create(data) {
        if (data.activo !== undefined && !data.estado) {
            data.estado = data.activo ? 'activo' : 'pendiente';
        }
        return this.prisma.comercio.create({ data });
    }
    async update(id, data) {
        if (data.activo !== undefined) {
            if (data.activo === true) {
                data.estado = 'activo';
                data.fecha_activacion = new Date();
                data.fecha_suspension = null;
                data.motivo_suspension = null;
            }
            else {
                data.estado = 'suspendido';
                data.fecha_suspension = new Date();
            }
        }
        return this.prisma.comercio.update({
            where: { comercio_id: id },
            data
        });
    }
    async remove(id) {
        await this.prisma.turno.deleteMany({ where: { comercio_id: id } });
        await this.prisma.servicio.deleteMany({ where: { comercio_id: id } });
        await this.prisma.empleado.deleteMany({ where: { comercio_id: id } });
        await this.prisma.cliente.deleteMany({ where: { comercio_id: id } });
        await this.prisma.usuario.deleteMany({ where: { comercio_id: id } });
        return this.prisma.comercio.delete({
            where: { comercio_id: id }
        });
    }
};
exports.ComerciosService = ComerciosService;
exports.ComerciosService = ComerciosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComerciosService);
//# sourceMappingURL=comercios.service.js.map