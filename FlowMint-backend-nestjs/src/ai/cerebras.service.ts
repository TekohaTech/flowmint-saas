import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cerebras } from '@cerebras/cerebras_cloud_sdk';

@Injectable()
export class CerebrasService {
  private readonly logger = new Logger(CerebrasService.name);
  private cerebras: Cerebras | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('CEREBRAS_API_KEY');
    if (apiKey) {
      this.cerebras = new Cerebras({ apiKey });
      this.logger.log('Cerebras service initialized');
    } else {
      this.logger.warn('CEREBRAS_API_KEY is not configured. AI features using Cerebras will be disabled.');
    }
  }

  async getChatCompletion(messages: any[]) {
    if (!this.cerebras) {
      throw new Error('Cerebras AI service is not configured');
    }
    return this.cerebras.chat.completions.create({
      messages,
      model: 'llama3.1-8b',
    });
  }

  isAvailable(): boolean {
    return this.cerebras !== null;
  }
}
