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
exports.TurnosController = void 0;
const common_1 = require("@nestjs/common");
const turnos_service_1 = require("./turnos.service");
const create_turno_dto_1 = require("./dto/create-turno.dto");
const update_turno_dto_1 = require("./dto/update-turno.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let TurnosController = class TurnosController {
    turnosService;
    constructor(turnosService) {
        this.turnosService = turnosService;
    }
    create(createTurnoDto, req) {
        const comercioId = req.user.comercio_id;
        return this.turnosService.create(createTurnoDto, comercioId);
    }
    findAll(req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.turnosService.findAll(comercioId);
    }
    findOne(id, req) {
        const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
        return this.turnosService.findOne(id, comercioId);
    }
    update(id, updateTurnoDto, req) {
        const comercioId = req.user.comercio_id;
        return this.turnosService.update(id, updateTurnoDto, comercioId);
    }
    remove(id, req) {
        const comercioId = req.user.comercio_id;
        return this.turnosService.remove(id, comercioId);
    }
};
exports.TurnosController = TurnosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_turno_dto_1.CreateTurnoDto, Object]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_turno_dto_1.UpdateTurnoDto, Object]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TurnosController.prototype, "remove", null);
exports.TurnosController = TurnosController = __decorate([
    (0, swagger_1.ApiTags)('appointments'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('turnos'),
    __metadata("design:paramtypes", [turnos_service_1.TurnosService])
], TurnosController);
//# sourceMappingURL=turnos.controller.js.map