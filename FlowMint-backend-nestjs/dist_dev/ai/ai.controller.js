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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const ai_orchestrator_service_1 = require("./ai-orchestrator.service");
let AiController = class AiController {
    aiService;
    aiOrchestratorService;
    constructor(aiService, aiOrchestratorService) {
        this.aiService = aiService;
        this.aiOrchestratorService = aiOrchestratorService;
    }
    async chat(chatRequest) {
        if (chatRequest.messages && chatRequest.messages.length > 0) {
            const lastMessage = chatRequest.messages[chatRequest.messages.length - 1];
            const response = await this.aiService.getAIResponse(lastMessage.content);
            return { response };
        }
        if (chatRequest.message) {
            const response = await this.aiService.getAIResponse(chatRequest.message);
            return { response };
        }
        return { response: 'No message provided' };
    }
    async chatStream(chatRequest, res) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        const message = chatRequest.messages?.[chatRequest.messages.length - 1]?.content || chatRequest.message || '';
        try {
            for await (const chunk of this.aiOrchestratorService.generateStream(message, "Eres un asistente útil para FlowMint, un sistema de gestión de turnos. Ayuda a los usuarios con preguntas sobre cómo usar la aplicación, gestionar turnos, clientes, empleados, servicios y reportes de ganancias. Responde en español de forma clara, directa y concisa.")) {
                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
            }
            res.write('data: [DONE]\n\n');
            res.end();
        }
        catch (error) {
            res.write(`data: ${JSON.stringify({ error: 'Error generating AI response' })}\n\n`);
            res.end();
        }
    }
    getProviderStatus() {
        return this.aiOrchestratorService.getProviderStatus();
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chat", null);
__decorate([
    (0, common_1.Post)('chat/stream'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chatStream", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getProviderStatus", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        ai_orchestrator_service_1.AiOrchestratorService])
], AiController);
//# sourceMappingURL=ai.controller.js.map