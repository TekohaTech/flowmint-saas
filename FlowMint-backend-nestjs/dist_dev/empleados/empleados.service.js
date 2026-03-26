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
exports.EmpleadosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmpleadosService = class EmpleadosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createEmpleadoDto, comercioId) {
        return this.prisma.empleado.create({
            data: {
                ...createEmpleadoDto,
                comercio_id: comercioId,
            },
        });
    }
    findAll(comercioId) {
        const where = comercioId ? { comercio_id: comercioId, estado: 'A' } : { estado: 'A' };
        return this.prisma.empleado.findMany({ where });
    }
    async findOne(id, comercioId) {
        const where = comercioId ? { empleado_id: id, comercio_id: comercioId } : { empleado_id: id };
        const empleado = await this.prisma.empleado.findFirst({ where });
        if (!empleado || empleado.estado === 'B') {
            throw new common_1.NotFoundException(`Empleado #${id} no encontrado`);
        }
        return empleado;
    }
    async update(id, updateEmpleadoDto, comercioId) {
        await this.findOne(id, comercioId);
        return this.prisma.empleado.update({
            where: { empleado_id: id },
            data: updateEmpleadoDto,
        });
    }
    async remove(id, comercioId) {
        await this.findOne(id, comercioId);
        return this.prisma.empleado.update({
            where: { empleado_id: id },
            data: { estado: 'B' },
        });
    }
};
exports.EmpleadosService = EmpleadosService;
exports.EmpleadosService = EmpleadosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmpleadosService);
//# sourceMappingURL=empleados.service.js.map