"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmpleadoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_empleado_dto_1 = require("./create-empleado.dto");
class UpdateEmpleadoDto extends (0, swagger_1.PartialType)(create_empleado_dto_1.CreateEmpleadoDto) {
}
exports.UpdateEmpleadoDto = UpdateEmpleadoDto;
//# sourceMappingURL=update-empleado.dto.js.map