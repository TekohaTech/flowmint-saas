import { ConfigService } from '@nestjs/config';
export declare class GroqService {
    private configService;
    private readonly logger;
    private groq;
    name: string;
    isConfigured: boolean;
    constructor(configService: ConfigService);
    chat(messages: any[]): Promise<string>;
    chatStream(messages: any[]): AsyncGenerator<string>;
}
