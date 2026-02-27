import { Controller, Post, Body, UseGuards, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiOrchestratorService } from './ai-orchestrator.service';

export interface ChatRequest {
  message?: string;
  messages?: Array<{ role: string; content: string }>;
}

export interface ChatResponse {
  response: string;
}

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly aiOrchestratorService: AiOrchestratorService,
  ) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  async chat(@Body() chatRequest: ChatRequest): Promise<ChatResponse> {
    if (chatRequest.messages && chatRequest.messages.length > 0) {
      const lastMessage = chatRequest.messages[chatRequest.messages.length - 1];
      const response = await this.aiService.getAIResponse(lastMessage.content);
      return { response };
    }
    
    if (chatRequest.message) {
      const response = await this.aiService.getAIResponse(chatRequest.message);
      return { response };
    }
    
    return { response: 'No message provided' };
  }

  @Post('chat/stream')
  @UseGuards(JwtAuthGuard)
  async chatStream(@Body() chatRequest: ChatRequest, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const message = chatRequest.messages?.[chatRequest.messages.length - 1]?.content || chatRequest.message || '';

    try {
      for await (const chunk of this.aiOrchestratorService.generateStream(
        message,
        "Eres un asistente útil para FlowMint, un sistema de gestión de turnos. Ayuda a los usuarios con preguntas sobre cómo usar la aplicación, gestionar turnos, clientes, empleados, servicios y reportes de ganancias. Responde en español de forma clara, directa y concisa."
      )) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: 'Error generating AI response' })}\n\n`);
      res.end();
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  getProviderStatus() {
    return this.aiOrchestratorService.getProviderStatus();
  }
}
