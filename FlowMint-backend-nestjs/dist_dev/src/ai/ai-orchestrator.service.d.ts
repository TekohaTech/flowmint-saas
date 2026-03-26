import { OnModuleInit } from '@nestjs/common';
import { GroqService } from './groq.service';
import { CerebrasService } from './cerebras.service';
export declare class AiOrchestratorService implements OnModuleInit {
    private groqService;
    private cerebrasService;
    private readonly logger;
    private providers;
    constructor(groqService: GroqService, cerebrasService: CerebrasService);
    onModuleInit(): void;
    chat(messages: any[], providerName?: string): Promise<any>;
    chatStream(messages: any[], providerName?: string): Promise<any>;
    generateResponse(message: string, systemPrompt?: string): Promise<string>;
    generateStream(message: string, systemPrompt?: string): AsyncGenerator<string>;
    getProviderStatus(): any;
}
