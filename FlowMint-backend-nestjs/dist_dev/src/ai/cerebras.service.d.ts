import { ConfigService } from '@nestjs/config';
export declare class CerebrasService {
    private configService;
    private readonly logger;
    private cerebras;
    name: string;
    isConfigured: boolean;
    constructor(configService: ConfigService);
    chat(messages: any[]): Promise<string>;
    chatStream(messages: any[]): AsyncGenerator<string>;
}
