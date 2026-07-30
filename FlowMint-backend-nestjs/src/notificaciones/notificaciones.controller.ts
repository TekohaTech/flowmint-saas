import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolNombre } from '../roles/entities/rol-nombre.enum';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';

@ApiTags('Notificaciones')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private notificacionesService: NotificacionesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RolNombre.SUPERADMIN)
  @ApiOperation({ summary: 'Crear notificación (solo admin)' })
  create(@Body() dto: CreateNotificacionDto, @Request() req) {
    return this.notificacionesService.create(dto, req.user);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Obtener notificaciones del usuario actual' })
  @ApiQuery({ name: 'unread_only', required: false, type: Boolean })
  getMine(
    @Request() req,
    @Query('unread_only') unreadOnly?: string,
  ) {
    return this.notificacionesService.findByUser(
      req.user,
      unreadOnly === 'true',
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Contar notificaciones no leídas' })
  getUnreadCount(@Request() req) {
    return this.notificacionesService.getUnreadCount(req.user);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.notificacionesService.markAsRead(id, req.user);
  }
}
