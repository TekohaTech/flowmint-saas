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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("./usuarios.service");
const create_usuario_dto_1 = require("./dto/create-usuario.dto");
const update_usuario_dto_1 = require("./dto/update-usuario.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const rol_nombre_enum_1 = require("../roles/entities/rol-nombre.enum");
let UsuariosController = class UsuariosController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    create(createUsuarioDto, req) {
        if (req.user.rol.nombre !== rol_nombre_enum_1.RolNombre.SUPERADMIN) {
            createUsuarioDto.comercio_id = req.user.comercio_id;
        }
        return this.usuariosService.create(createUsuarioDto);
    }
    findAll(req) {
        if (req.user.rol.nombre === rol_nombre_enum_1.RolNombre.SUPERADMIN) {
            return this.usuariosService.findAll();
        }
        return this.usuariosService.findAllByComercio(req.user.comercio_id);
    }
    async findOne(id, req) {
        const user = await this.usuariosService.findOne(id);
        if (req.user?.rol?.nombre !== rol_nombre_enum_1.RolNombre.SUPERADMIN && user?.comercio_id !== req.user?.comercio_id) {
            return null;
        }
        return user;
    }
    async update(id, updateUsuarioDto, req) {
        if (req.user?.rol?.nombre !== rol_nombre_enum_1.RolNombre.SUPERADMIN) {
            const user = await this.usuariosService.findOne(id);
            if (user?.comercio_id !== req.user?.comercio_id) {
                throw new common_1.ForbiddenException('No tienes permiso para editar este usuario.');
            }
            delete updateUsuarioDto.comercio_id;
        }
        return this.usuariosService.update(id, updateUsuarioDto);
    }
    async remove(id, req) {
        if (req.user?.rol?.nombre !== rol_nombre_enum_1.RolNombre.SUPERADMIN) {
            const user = await this.usuariosService.findOne(id);
            if (user?.comercio_id !== req.user?.comercio_id) {
                throw new common_1.ForbiddenException('No tienes permiso para eliminar este usuario.');
            }
        }
        return this.usuariosService.remove(id);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN, rol_nombre_enum_1.RolNombre.DUENO),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_usuario_dto_1.CreateUsuarioDto, Object]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN, rol_nombre_enum_1.RolNombre.DUENO),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsuariosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN, rol_nombre_enum_1.RolNombre.DUENO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN, rol_nombre_enum_1.RolNombre.DUENO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_usuario_dto_1.UpdateUsuarioDto, Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(rol_nombre_enum_1.RolNombre.SUPERADMIN, rol_nombre_enum_1.RolNombre.DUENO),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "remove", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map