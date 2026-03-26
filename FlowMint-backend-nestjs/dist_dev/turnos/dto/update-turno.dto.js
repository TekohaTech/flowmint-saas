"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTurnoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_turno_dto_1 = require("./create-turno.dto");
class UpdateTurnoDto extends (0, swagger_1.PartialType)(create_turno_dto_1.CreateTurnoDto) {
}
exports.UpdateTurnoDto = UpdateTurnoDto;
//# sourceMappingURL=update-turno.dto.js.map