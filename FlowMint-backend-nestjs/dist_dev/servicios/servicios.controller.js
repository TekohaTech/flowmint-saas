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
exports.ServiciosController = void 0;
const common_1 = require("@nestjs/common");
const servicios_service_1 = require("./servicios.service");
const create_servicio_dto_1 = require("./dto/create-servicio.dto");
const update_servicio_dto_1 = require("./dto/update-servicio.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ServiciosController = class ServiciosController {
    serviciosService;
    constructor(serviciosService) {
        this.serviciosService = serviciosService;
    }
    create(createServicioDto, req) {
        const comercioId = req.user.comercio_id;
        return this.serviciosService.create(createServicioDto, comercioId);
    }
    findAll(req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.serviciosService.findAll(comercioId);
    }
    findOne(id, req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.serviciosService.findOne(id, comercioId);
    }
    update(id, updateServicioDto, req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.serviciosService.update(id, updateServicioDto, comercioId);
    }
    remove(id, req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.serviciosService.remove(id, comercioId);
    }
};
exports.ServiciosController = ServiciosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_servicio_dto_1.CreateServicioDto, Object]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_servicio_dto_1.UpdateServicioDto, Object]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "remove", null);
exports.ServiciosController = ServiciosController = __decorate([
    (0, swagger_1.ApiTags)('services'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('servicios'),
    __metadata("design:paramtypes", [servicios_service_1.ServiciosService])
], ServiciosController);
//# sourceMappingURL=servicios.controller.js.map