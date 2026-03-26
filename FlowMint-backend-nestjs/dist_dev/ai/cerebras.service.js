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
var CerebrasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CerebrasService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cerebras_cloud_sdk_1 = require("@cerebras/cerebras_cloud_sdk");
let CerebrasService = CerebrasService_1 = class CerebrasService {
    configService;
    logger = new common_1.Logger(CerebrasService_1.name);
    cerebras = null;
    name = 'cerebras';
    isConfigured = false;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('CEREBRAS_API_KEY');
        if (apiKey) {
            this.cerebras = new cerebras_cloud_sdk_1.Cerebras({ apiKey });
            this.isConfigured = true;
            this.logger.log('Cerebras service initialized');
        }
        else {
            this.logger.warn('CEREBRAS_API_KEY is not configured. AI features using Cerebras will be disabled.');
        }
    }
    async chat(messages) {
        if (!this.cerebras) {
            throw new Error('Cerebras AI service is not configured');
        }
        const completion = await this.cerebras.chat.completions.create({
            messages,
            model: 'llama3.1-8b',
        });
        return completion.choices[0]?.message?.content || '';
    }
    async *chatStream(messages) {
        if (!this.cerebras) {
            throw new Error('Cerebras AI service is not configured');
        }
        const stream = await this.cerebras.chat.completions.create({
            messages,
            model: 'llama3.1-8b',
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
exports.CerebrasService = CerebrasService;
exports.CerebrasService = CerebrasService = CerebrasService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CerebrasService);
//# sourceMappingURL=cerebras.service.js.map