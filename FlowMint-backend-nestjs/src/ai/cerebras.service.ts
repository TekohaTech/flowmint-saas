import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cerebras } from '@cerebras/cerebras_cloud_sdk';

@Injectable()
export class CerebrasService {
  private readonly logger = new Logger(CerebrasService.name);
  private cerebras: Cerebras | null = null;
  name = 'cerebras';
  isConfigured = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('CEREBRAS_API_KEY');
    if (apiKey) {
      this.cerebras = new Cerebras({ apiKey });
      this.isConfigured = true;
      this.logger.log('Cerebras service initialized');
    } else {
      this.logger.warn('CEREBRAS_API_KEY is not configured. AI features using Cerebras will be disabled.');
    }
  }

  async chat(messages: any[]): Promise<string> {
    if (!this.cerebras) {
      throw new Error('Cerebras AI service is not configured');
    }
    const completion: any = await this.cerebras.chat.completions.create({
      messages,
      model: 'llama3.1-8b',
    });
    return completion.choices[0]?.message?.content || '';
  }

  async *chatStream(messages: any[]): AsyncGenerator<string> {
    if (!this.cerebras) {
      throw new Error('Cerebras AI service is not configured');
    }
    const stream: any = await this.cerebras.chat.completions.create({
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
}
