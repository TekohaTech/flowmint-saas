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

  private selectProviders(providerName?: string): any[] {
    if (!providerName) {
      return [...this.providers];
    }
    return this.providers.filter(p => p.name === providerName);
  }

  async chat(messages: any[], providerName?: string): Promise<string> {
    const candidates = this.selectProviders(providerName);
    if (candidates.length === 0) {
      throw new Error(
        providerName
          ? `Provider ${providerName} not found`
          : 'No AI providers available. Please configure API keys.',
      );
    }

    let lastError: unknown = null;
    for (const provider of candidates) {
      try {
        const response = await provider.chat(messages);
        this.logger.log(`AI response from provider '${provider.name}'`);
        return response;
      } catch (error: any) {
        lastError = error;
        this.logger.error(
          `AI provider '${provider.name}' failed: ${error?.message ?? error}. Trying next provider...`,
        );
      }
    }

    throw lastError ?? new Error('All AI providers failed');
  }

  async *chatStream(messages: any[], providerName?: string): AsyncGenerator<string> {
    const candidates = this.selectProviders(providerName);
    if (candidates.length === 0) {
      throw new Error(
        providerName
          ? `Provider ${providerName} not found`
          : 'No AI providers available. Please configure API keys.',
      );
    }

    let lastError: unknown = null;
    for (const provider of candidates) {
      try {
        const stream = provider.chatStream(messages);
        for await (const chunk of stream) {
          yield chunk;
        }
        this.logger.log(`AI stream completed from provider '${provider.name}'`);
        return;
      } catch (error: any) {
        lastError = error;
        this.logger.error(
          `AI provider '${provider.name}' failed: ${error?.message ?? error}. Trying next provider...`,
        );
      }
    }

    throw lastError ?? new Error('All AI providers failed');
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