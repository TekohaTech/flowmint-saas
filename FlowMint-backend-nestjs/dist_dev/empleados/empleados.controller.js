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
exports.EmpleadosController = void 0;
const common_1 = require("@nestjs/common");
const empleados_service_1 = require("./empleados.service");
const create_empleado_dto_1 = require("./dto/create-empleado.dto");
const update_empleado_dto_1 = require("./dto/update-empleado.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let EmpleadosController = class EmpleadosController {
    empleadosService;
    constructor(empleadosService) {
        this.empleadosService = empleadosService;
    }
    create(createEmpleadoDto, req) {
        const comercioId = req.user.comercio_id;
        return this.empleadosService.create(createEmpleadoDto, comercioId);
    }
    findAll(req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.empleadosService.findAll(comercioId);
    }
    findOne(id, req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.empleadosService.findOne(id, comercioId);
    }
    update(id, updateEmpleadoDto, req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.empleadosService.update(id, updateEmpleadoDto, comercioId);
    }
    remove(id, req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.empleadosService.remove(id, comercioId);
    }
};
exports.EmpleadosController = EmpleadosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_empleado_dto_1.CreateEmpleadoDto, Object]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_empleado_dto_1.UpdateEmpleadoDto, Object]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "remove", null);
exports.EmpleadosController = EmpleadosController = __decorate([
    (0, swagger_1.ApiTags)('employees'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('empleados'),
    __metadata("design:paramtypes", [empleados_service_1.EmpleadosService])
], EmpleadosController);
//# sourceMappingURL=empleados.controller.js.map