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
var GroqService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
let GroqService = GroqService_1 = class GroqService {
    configService;
    logger = new common_1.Logger(GroqService_1.name);
    groq = null;
    name = 'groq';
    isConfigured = false;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (apiKey) {
            this.groq = new groq_sdk_1.Groq({ apiKey });
            this.isConfigured = true;
            this.logger.log('Groq service initialized');
        }
        else {
            this.logger.warn('GROQ_API_KEY is not configured. AI features using Groq will be disabled.');
        }
    }
    async chat(messages) {
        if (!this.groq) {
            throw new Error('Groq AI service is not configured');
        }
        const completion = await this.groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
        });
        return completion.choices[0]?.message?.content || '';
    }
    async *chatStream(messages) {
        if (!this.groq) {
            throw new Error('Groq AI service is not configured');
        }
        const stream = await this.groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            stream: true,
        });
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }
};
exports.GroqService = GroqService;
exports.GroqService = GroqService = GroqService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GroqService);
//# sourceMappingURL=groq.service.js.map