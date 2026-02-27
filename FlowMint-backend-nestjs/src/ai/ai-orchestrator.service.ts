import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { GroqService } from './groq.service';
import { CerebrasService } from './cerebras.service';

@Injectable()
export class AiOrchestratorService implements OnModuleInit {
  private readonly logger = new Logger(AiOrchestratorService.name);
  private providers: any[] = [];

  constructor(
    private groqService: GroqService,
    private cerebrasService: CerebrasService,
  ) {}

  onModuleInit() {
    this.providers.push(this.groqService);
    this.providers.push(this.cerebrasService);
    this.logger.log('AI Orchestrator initialized with ' + this.providers.length + ' providers');
  }

  async chat(messages: any[], providerName?: string) {
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

  async chatStream(messages: any[], providerName?: string) {
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

  async generateResponse(message: string, systemPrompt?: string): Promise<string> {
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

  async *generateStream(message: string, systemPrompt?: string): AsyncGenerator<string> {
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

  getProviderStatus(): any {
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
}
