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
exports.CreateUsuarioDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateUsuarioDto {
    nombre;
    apellido;
    dni;
    user;
    pass;
    correo;
    rol_id;
    comercio_id;
}
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The first name of the user.', example: 'Carlos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The last name of the user.', example: 'Rodriguez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The DNI (National Identity Document) of the user.',
        example: '12345678A',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "dni", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The username for logging in.',
        example: 'carlos.r',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The password for the user (minimum 6 characters).',
        example: 'securepass123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "pass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The email address of the user.',
        example: 'carlos.rodriguez@example.com',
        required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "correo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the role assigned to the user.',
        example: 2,
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUsuarioDto.prototype, "rol_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the business assigned to the user.',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUsuarioDto.prototype, "comercio_id", void 0);
//# sourceMappingURL=create-usuario.dto.js.map