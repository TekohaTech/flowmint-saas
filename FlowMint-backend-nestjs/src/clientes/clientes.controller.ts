import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('clients')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto, @Request() req) {
    const comercioId = req.user.comercio_id;
    return this.clientesService.create(createClienteDto, comercioId);
  }

  @Get()
  findAll(@Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.clientesService.findAll(comercioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.clientesService.findOne(id, comercioId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateClienteDto: UpdateClienteDto,
    @Request() req
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.clientesService.update(id, updateClienteDto, comercioId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    return this.clientesService.remove(id, comercioId);
  }
}
