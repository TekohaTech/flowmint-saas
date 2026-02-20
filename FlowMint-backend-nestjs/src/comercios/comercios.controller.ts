import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ComerciosService } from './comercios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolNombre } from 'src/roles/entities/rol-nombre.enum';

@ApiTags('comercios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('comercios')
export class ComerciosController {
  constructor(private readonly comerciosService: ComerciosService) {}

  @Get()
  @Roles(RolNombre.SUPERADMIN)
  findAll() {
    return this.comerciosService.findAll();
  }

  @Get(':id')
  @Roles(RolNombre.SUPERADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comerciosService.findOne(id);
  }

  @Post()
  @Roles(RolNombre.SUPERADMIN)
  create(@Body() data: any) {
    return this.comerciosService.create(data);
  }

  @Patch(':id')
  @Roles(RolNombre.SUPERADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.comerciosService.update(id, data);
  }

  @Delete(':id')
  @Roles(RolNombre.SUPERADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comerciosService.remove(id);
  }
}
