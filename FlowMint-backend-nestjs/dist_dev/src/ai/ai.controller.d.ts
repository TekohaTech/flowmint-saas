import type { Response } from 'express';
import { AiService } from './ai.service';
import { AiOrchestratorService } from './ai-orchestrator.service';
export interface ChatRequest {
    message?: string;
    messages?: Array<{
        role: string;
        content: string;
    }>;
}
export interface ChatResponse {
    response: string;
}
export declare class AiController {
    private readonly aiService;
    private readonly aiOrchestratorService;
    constructor(aiService: AiService, aiOrchestratorService: AiOrchestratorService);
    chat(chatRequest: ChatRequest): Promise<ChatResponse>;
    chatStream(chatRequest: ChatRequest, res: Response): Promise<void>;
    getProviderStatus(): any;
}
