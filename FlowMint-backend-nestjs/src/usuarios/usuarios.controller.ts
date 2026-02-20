import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolNombre } from 'src/roles/entities/rol-nombre.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(RolNombre.SUPERADMIN, RolNombre.DUENO)
  create(@Body() createUsuarioDto: CreateUsuarioDto, @Request() req) {
    // If not SuperAdmin, force the commerce ID to the user's own commerce
    if (req.user.rol.nombre !== RolNombre.SUPERADMIN) {
      createUsuarioDto.comercio_id = req.user.comercio_id;
    }
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Roles(RolNombre.SUPERADMIN, RolNombre.DUENO)
  findAll(@Request() req) {
    if (req.user.rol.nombre === RolNombre.SUPERADMIN) {
      return this.usuariosService.findAll();
    }
    return this.usuariosService.findAllByComercio(req.user.comercio_id);
  }

  @Get(':id')
  @Roles(RolNombre.SUPERADMIN, RolNombre.DUENO)
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = await this.usuariosService.findOne(id);
    // Security: Check if owner is trying to access user from another commerce
    if (req.user?.rol?.nombre !== RolNombre.SUPERADMIN && user?.comercio_id !== req.user?.comercio_id) {
      return null;
    }
    return user;
  }

  @Patch(':id')
  @Roles(RolNombre.SUPERADMIN, RolNombre.DUENO)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto, @Request() req) {
    // Security: Ensure the owner can only update users from their own commerce
    if (req.user?.rol?.nombre !== RolNombre.SUPERADMIN) {
      const user = await this.usuariosService.findOne(id);
      if (user?.comercio_id !== req.user?.comercio_id) {
        throw new ForbiddenException('No tienes permiso para editar este usuario.');
      }
      delete updateUsuarioDto.comercio_id; // Prevent owner from changing commerce
    }
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @Roles(RolNombre.SUPERADMIN, RolNombre.DUENO)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req.user?.rol?.nombre !== RolNombre.SUPERADMIN) {
      const user = await this.usuariosService.findOne(id);
      if (user?.comercio_id !== req.user?.comercio_id) {
        throw new ForbiddenException('No tienes permiso para eliminar este usuario.');
      }
    }
    return this.usuariosService.remove(id);
  }
}
