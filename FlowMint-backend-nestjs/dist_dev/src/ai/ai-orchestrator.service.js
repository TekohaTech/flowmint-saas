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
var AiOrchestratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const groq_service_1 = require("./groq.service");
const cerebras_service_1 = require("./cerebras.service");
let AiOrchestratorService = AiOrchestratorService_1 = class AiOrchestratorService {
    groqService;
    cerebrasService;
    logger = new common_1.Logger(AiOrchestratorService_1.name);
    providers = [];
    constructor(groqService, cerebrasService) {
        this.groqService = groqService;
        this.cerebrasService = cerebrasService;
    }
    onModuleInit() {
        this.providers.push(this.groqService);
        this.providers.push(this.cerebrasService);
        this.logger.log('AI Orchestrator initialized with ' + this.providers.length + ' providers');
    }
    async chat(messages, providerName) {
        if (this.providers.length === 0) {
            throw new Error('No AI providers available. Please configure API keys.');
        }
        const provider = providerName
            ? this.providers.find(p => p.name === providerName)
            : this.providers[0];
        if (!provider) {
            throw new Error(`Provider ${providerName} not found`);
        }
        return provider.chat(messages);
    }
    async chatStream(messages, providerName) {
        if (this.providers.length === 0) {
            throw new Error('No AI providers available. Please configure API keys.');
        }
        const provider = providerName
            ? this.providers.find(p => p.name === providerName)
            : this.providers[0];
        if (!provider) {
            throw new Error(`Provider ${providerName} not found`);
        }
        return provider.chatStream(messages);
    }
    async generateResponse(message, systemPrompt) {
        if (this.providers.length === 0) {
            return "The AI service is currently unavailable. Please check the server logs for more information.";
        }
        const messages = [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: message }
        ];
        const response = await this.chat(messages);
        return response;
    }
    async *generateStream(message, systemPrompt) {
        if (this.providers.length === 0) {
            yield "The AI service is currently unavailable.";
            return;
        }
        const messages = [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: message }
        ];
        const stream = await this.chatStream(messages);
        for await (const chunk of stream) {
            yield chunk;
        }
    }
    getProviderStatus() {
        return {
            status: this.providers.length > 0 ? 'enabled' : 'disabled',
            providers: this.providers.map(p => ({
                name: p.name,
                status: p.isConfigured ? 'configured' : 'not_configured'
            })),
            message: this.providers.length > 0
                ? 'AI providers are enabled.'
                : 'No AI providers configured. Add API keys to .env file.',
        };
    }
};
exports.AiOrchestratorService = AiOrchestratorService;
exports.AiOrchestratorService = AiOrchestratorService = AiOrchestratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [groq_service_1.GroqService,
        cerebras_service_1.CerebrasService])
], AiOrchestratorService);
//# sourceMappingURL=ai-orchestrator.service.js.map