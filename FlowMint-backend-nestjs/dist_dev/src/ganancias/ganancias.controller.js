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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GananciasController = void 0;
const common_1 = require("@nestjs/common");
const ganancias_service_1 = require("./ganancias.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let GananciasController = class GananciasController {
    gananciasService;
    constructor(gananciasService) {
        this.gananciasService = gananciasService;
    }
    getGananciasDiarias(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getGananciasDiarias(comercioId, start, end);
    }
    getGananciasSemanales(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getGananciasSemanales(comercioId, start, end);
    }
    getGananciasMensuales(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getGananciasMensuales(comercioId, start, end);
    }
    getGananciasAnuales(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getGananciasAnuales(comercioId, start, end);
    }
    getGananciasMensualesPorServicio(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getGananciasMensualesPorServicio(comercioId, start, end);
    }
    getGananciasMensualesPorEmpleado(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getGananciasMensualesPorEmpleado(comercioId, start, end);
    }
    getGananciasAnualesPorServicio(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getGananciasAnualesPorServicio(comercioId, start, end);
    }
    getGananciasAnualesPorEmpleado(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getGananciasAnualesPorEmpleado(comercioId, start, end);
    }
    getResumenGanancias(req, startDate, endDate) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.gananciasService.getResumenGanancias(comercioId, start, end);
    }
};
exports.GananciasController = GananciasController;
__decorate([
    (0, common_1.Get)('diarias'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getGananciasDiarias", null);
__decorate([
    (0, common_1.Get)('semanales'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getGananciasSemanales", null);
__decorate([
    (0, common_1.Get)('mensuales'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getGananciasMensuales", null);
__decorate([
    (0, common_1.Get)('anuales'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getGananciasAnuales", null);
__decorate([
    (0, common_1.Get)('mensuales-por-servicio'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getGananciasMensualesPorServicio", null);
__decorate([
    (0, common_1.Get)('mensuales-por-empleado'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getGananciasMensualesPorEmpleado", null);
__decorate([
    (0, common_1.Get)('anuales-por-servicio'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getGananciasAnualesPorServicio", null);
__decorate([
    (0, common_1.Get)('anuales-por-empleado'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getGananciasAnualesPorEmpleado", null);
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], GananciasController.prototype, "getResumenGanancias", null);
exports.GananciasController = GananciasController = __decorate([
    (0, swagger_1.ApiTags)('revenue'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ganancias'),
    __metadata("design:paramtypes", [ganancias_service_1.GananciasService])
], GananciasController);
//# sourceMappingURL=ganancias.controller.js.map