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
exports.ServiciosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServiciosService = class ServiciosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createServicioDto, comercioId) {
        return this.prisma.servicio.create({
            data: {
                ...createServicioDto,
                comercio_id: comercioId,
            },
        });
    }
    findAll(comercioId) {
        const where = comercioId ? { comercio_id: comercioId, estado: 'A' } : { estado: 'A' };
        return this.prisma.servicio.findMany({ where });
    }
    async findOne(id, comercioId) {
        const where = comercioId ? { servicio_id: id, comercio_id: comercioId } : { servicio_id: id };
        const servicio = await this.prisma.servicio.findFirst({ where });
        if (!servicio || servicio.estado === 'B') {
            throw new common_1.NotFoundException(`Servicio #${id} no encontrado`);
        }
        return servicio;
    }
    async update(id, updateServicioDto, comercioId) {
        await this.findOne(id, comercioId);
        return this.prisma.servicio.update({
            where: { servicio_id: id },
            data: updateServicioDto,
        });
    }
    async remove(id, comercioId) {
        await this.findOne(id, comercioId);
        return this.prisma.servicio.update({
            where: { servicio_id: id },
            data: { estado: 'B' },
        });
    }
};
exports.ServiciosService = ServiciosService;
exports.ServiciosService = ServiciosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiciosService);
//# sourceMappingURL=servicios.service.js.map