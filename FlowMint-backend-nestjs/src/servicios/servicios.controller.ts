import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('services')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  create(@Body() createServicioDto: CreateServicioDto, @Request() req) {
    const comercioId = req.user.comercio_id;
    return this.serviciosService.create(createServicioDto, comercioId);
  }

  @Get()
  findAll(@Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.serviciosService.findAll(comercioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.serviciosService.findOne(id, comercioId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateServicioDto: UpdateServicioDto,
    @Request() req
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.serviciosService.update(id, updateServicioDto, comercioId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.serviciosService.remove(id, comercioId);
  }
}
