import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('appointments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto, @Request() req) {
    const comercioId = req.user.comercio_id;
    return this.turnosService.create(createTurnoDto, comercioId);
  }

  @Get()
  findAll(@Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.turnosService.findAll(comercioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.turnosService.findOne(id, comercioId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTurnoDto: UpdateTurnoDto,
    @Request() req
  ) {
    const comercioId = req.user.comercio_id; // Aquí no permitimos null porque update requiere contexto
    return this.turnosService.update(id, updateTurnoDto, comercioId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comercioId = req.user.comercio_id;
    return this.turnosService.remove(id, comercioId);
  }
}
