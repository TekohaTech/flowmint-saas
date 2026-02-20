import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('employees')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  create(@Body() createEmpleadoDto: CreateEmpleadoDto, @Request() req) {
    const comercioId = req.user.comercio_id;
    return this.empleadosService.create(createEmpleadoDto, comercioId);
  }

  @Get()
  findAll(@Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.empleadosService.findAll(comercioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.empleadosService.findOne(id, comercioId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateEmpleadoDto: UpdateEmpleadoDto,
    @Request() req
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.empleadosService.update(id, updateEmpleadoDto, comercioId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.empleadosService.remove(id, comercioId);
  }
}
