import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Cookie Parser
  app.use(cookieParser());

  // Enable CORS
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'set-cookie'],
  });

  // Configure global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error if extra properties exist
      transform: true, // Transform types automatically
    }),
  );

  // Configure global prefix for API routes
  app.setGlobalPrefix('api');

  // Configure Swagger documentation
  const config = new DocumentBuilder()
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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FlowMint API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: `
      .swagger-ui .topbar { background-color: #1a1a2e; }
      .swagger-ui .info .title { color: #16f2b3; }
    `,
  });

  // Configure Prisma
  const prismaService = app.get(PrismaService);
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
