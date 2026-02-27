import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private groq: Groq | null = null;
  name = 'groq';
  isConfigured = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.groq = new Groq({ apiKey });
      this.isConfigured = true;
      this.logger.log('Groq service initialized');
    } else {
      this.logger.warn('GROQ_API_KEY is not configured. AI features using Groq will be disabled.');
    }
  }

  async chat(messages: any[]): Promise<string> {
    if (!this.groq) {
      throw new Error('Groq AI service is not configured');
    }
    const completion: any = await this.groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
    });
    return completion.choices[0]?.message?.content || '';
  }

  async *chatStream(messages: any[]): AsyncGenerator<string> {
    if (!this.groq) {
      throw new Error('Groq AI service is not configured');
    }
    const stream: any = await this.groq.chat.completions.create({
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
}
