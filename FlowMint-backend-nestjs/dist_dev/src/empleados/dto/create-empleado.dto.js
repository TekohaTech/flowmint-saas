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
exports.CreateEmpleadoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateEmpleadoDto {
    nombre;
    apellido;
    puesto;
}
exports.CreateEmpleadoDto = CreateEmpleadoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The first name of the employee.', example: 'Maria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEmpleadoDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The last name of the employee.', example: 'Gonzalez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateEmpleadoDto.prototype, "apellido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The position or role of the employee.',
        example: 'Estilista Senior',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateEmpleadoDto.prototype, "puesto", void 0);
//# sourceMappingURL=create-empleado.dto.js.map