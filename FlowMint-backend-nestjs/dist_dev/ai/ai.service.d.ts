import { AiOrchestratorService } from './ai-orchestrator.service';
export declare class AiService {
    private aiOrchestratorService;
    constructor(aiOrchestratorService: AiOrchestratorService);
    getAIResponse(userMessage: string): Promise<string>;
}
