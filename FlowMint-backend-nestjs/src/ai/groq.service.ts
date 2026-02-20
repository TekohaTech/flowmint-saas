import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private groq: Groq | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.groq = new Groq({ apiKey });
      this.logger.log('Groq service initialized');
    } else {
      this.logger.warn('GROQ_API_KEY is not configured. AI features using Groq will be disabled.');
    }
  }

  async getChatCompletion(messages: any[]) {
    if (!this.groq) {
      throw new Error('Groq AI service is not configured');
    }
    return this.groq.chat.completions.create({
      messages,
      model: 'llama3-8b-8192',
    });
  }

  async getChatStream(messages: any[]) {
    if (!this.groq) {
      throw new Error('Groq AI service is not configured');
    }
    return this.groq.chat.completions.create({
      messages,
      model: 'llama3-8b-8192',
      stream: true,
    });
  }

  isAvailable(): boolean {
    return this.groq !== null;
  }
}
