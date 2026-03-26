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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const ai_orchestrator_service_1 = require("./ai-orchestrator.service");
let AiService = class AiService {
    aiOrchestratorService;
    constructor(aiOrchestratorService) {
        this.aiOrchestratorService = aiOrchestratorService;
    }
    async getAIResponse(userMessage) {
        return await this.aiOrchestratorService.generateResponse(userMessage, `Eres un asistente especializado para negocios de PELUQUERÍA, BARBERÍA, SPA y ESTÉTICA. Conoces todo sobre:
- Cortes de pelo, barba, tintura, mechas, tratamientos capilares
- Servicios: corte, peinado, color, reflejos, keratina, alisado
- Barbería: afeitado clásico, delineado de cejas
- Spa: masajes, tratamientos faciales, tratamientos corporales
- Belleza: uñas, manicura, pedicura, micropigmentación
- Gestión de turnos y agenda diaria
- Clientes frecuentes y su historial
- Empleados y sus horarios
- Servicios disponibles y precios
- Ganancias y reportes

INSTRUCCIONES:
- Responde en español de forma AMABLE y PROFESIONAL
- Usa emojis relevantes para hacer los mensajes más cordiales
- Para mensajes de clientes (cumpleaños, recordatorios, promociones), proporciona SIEMPRE una versión lista para copiar y pegar
- Sé conciso pero completo
- Si no sabes algo, admítelo y sugiere cómo resolverlo`);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_orchestrator_service_1.AiOrchestratorService])
], AiService);
//# sourceMappingURL=ai.service.js.map