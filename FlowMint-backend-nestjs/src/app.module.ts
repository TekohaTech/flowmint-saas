import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { ServiciosModule } from './servicios/servicios.module';
import { TurnosModule } from './turnos/turnos.module';
import { GananciasModule } from './ganancias/ganancias.module';
import { AiModule } from './ai/ai.module';
import { ComerciosModule } from './comercios/comercios.module';
import { EmailModule } from './email/email.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule, 
    RolesModule, 
    UsuariosModule, 
    AuthModule, 
    ClientesModule, 
    EmpleadosModule, 
    ServiciosModule, 
    TurnosModule, 
    GananciasModule, 
    AiModule, 
    ComerciosModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
