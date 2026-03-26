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
exports.ComerciosController = void 0;
const common_1 = require("@nestjs/common");
const comercios_service_1 = require("./comercios.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const rol_nombre_enum_1 = require("../roles/entities/rol-nombre.enum");
let ComerciosController = class ComerciosController {
    comerciosService;
    constructor(comerciosService) {
        this.comerciosService = comerciosService;
    }
    findAll() {
        return this.comerciosService.findAll();
    }
    findOne(id) {
        return this.comerciosService.findOne(id);
    }
    create(data) {
        return this.comerciosService.create(data);
    }
    update(id, data) {
        return this.comerciosService.update(id, data);
    }
    remove(id) {
        return this.comerciosService.remove(id);
    }
};
exports.ComerciosController = ComerciosController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ComerciosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ComerciosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ComerciosController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ComerciosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ComerciosController.prototype, "remove", null);
exports.ComerciosController = ComerciosController = __decorate([
    (0, swagger_1.ApiTags)('comercios'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('comercios'),
    __metadata("design:paramtypes", [comercios_service_1.ComerciosService])
], ComerciosController);
//# sourceMappingURL=comercios.controller.js.map