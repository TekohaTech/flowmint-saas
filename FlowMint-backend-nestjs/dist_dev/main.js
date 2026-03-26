"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dotenv = __importStar(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'set-cookie'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('FlowMint API')
        .setDescription('FlowMint appointment management system REST API')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('roles', 'Role management')
        .addTag('clients', 'Client management')
        .addTag('employees', 'Employee management')
        .addTag('services', 'Service management')
        .addTag('appointments', 'Appointment management')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'FlowMint API Documentation',
        customfavIcon: 'https://nestjs.com/img/logo_text.svg',
        customCss: `
      .swagger-ui .topbar { background-color: #1a1a2e; }
      .swagger-ui .info .title { color: #16f2b3; }
    `,
    });
    const prismaService = app.get(prisma_service_1.PrismaService);
    await prismaService.enableShutdownHooks(app);
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`
    🚀 Server running at: http://localhost:${port}
    📚 API available at: http://localhost:${port}/api
    📖 Swagger docs at: http://localhost:${port}/api/docs
    🗄️  Database: Supabase Local (PostgreSQL)
    🎨 Supabase Studio: http://localhost:54323
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map