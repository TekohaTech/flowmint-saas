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
exports.CreateTurnoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateTurnoDto {
    fecha_hora;
    estado;
    cliente_id;
    empleado_id;
    servicio_id;
}
exports.CreateTurnoDto = CreateTurnoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The date and time of the appointment in ISO 8601 format.',
        example: '2025-12-01T15:30:00.000Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateTurnoDto.prototype, "fecha_hora", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The status of the appointment.',
        example: 'pendiente',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTurnoDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the client.', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateTurnoDto.prototype, "cliente_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the employee.', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateTurnoDto.prototype, "empleado_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The ID of the service.', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateTurnoDto.prototype, "servicio_id", void 0);
//# sourceMappingURL=create-turno.dto.js.map