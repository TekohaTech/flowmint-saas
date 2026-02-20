import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { GananciasService } from './ganancias.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('revenue')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('ganancias')
export class GananciasController {
  constructor(private readonly gananciasService: GananciasService) {}

  @Get('diarias')
  getGananciasDiarias(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasDiarias(comercioId, start, end);
  }

  @Get('semanales')
  getGananciasSemanales(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasSemanales(comercioId, start, end);
  }

  @Get('mensuales')
  getGananciasMensuales(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasMensuales(comercioId, start, end);
  }

  @Get('anuales')
  getGananciasAnuales(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasAnuales(comercioId, start, end);
  }

  @Get('mensuales-por-servicio')
  getGananciasMensualesPorServicio(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasMensualesPorServicio(comercioId, start, end);
  }

  @Get('mensuales-por-empleado')
  getGananciasMensualesPorEmpleado(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasMensualesPorEmpleado(comercioId, start, end);
  }

  @Get('anuales-por-servicio')
  getGananciasAnualesPorServicio(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasAnualesPorServicio(comercioId, start, end);
  }

  @Get('anuales-por-empleado')
  getGananciasAnualesPorEmpleado(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getGananciasAnualesPorEmpleado(comercioId, start, end);
  }

  @Get('resumen')
  getResumenGanancias(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const comercioId = req.user.rol === 'SUPERADMIN' ? null : req.user.comercio_id;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.gananciasService.getResumenGanancias(comercioId, start, end);
  }
}
