import { Module } from '@nestjs/common';
import { ComerciosService } from './comercios.service';
import { ComerciosController } from './comercios.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComerciosController],
  providers: [ComerciosService],
  exports: [ComerciosService]
})
export class ComerciosModule {}
