import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CompletarRegistroDto } from './dto/completar-registro.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usuariosService.findByUsername(username);

    if (user && user.pass && (await bcrypt.compare(pass, user.pass))) {
      if (user.rol?.nombre !== 'SUPERADMIN') {
        if (!user.comercio) {
          throw new UnauthorizedException('El usuario no tiene un comercio asociado');
        }
        if (!user.comercio.activo) {
          throw new UnauthorizedException('Tu comercio se encuentra inactivo. Contacta al administrador.');
        }
      }

      const { pass: userPass, ...result } = user;
      return result;
    }

    return null;
  }

  async completarRegistro(dto: CompletarRegistroDto) {
    const user = await this.prisma.usuario.findFirst({
      where: { correo: dto.email },
      include: { comercio: true },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.comercio_id) {
      throw new BadRequestException('El usuario ya tiene un comercio asociado');
    }

    const comercio = await this.prisma.comercio.create({
      data: {
        nombre: dto.nombreComercio,
        direccion: dto.direccion,
        telefono: dto.telefono,
        email: dto.emailComercio,
        categoria: dto.categoria,
        activo: false,
        estado: 'pendiente',
        dueno_nombre: user.nombre,
        dueno_apellido: user.apellido,
        dueno_email: user.correo,
      },
    });

    await this.prisma.usuario.update({
      where: { usuario_id: user.usuario_id },
      data: { comercio_id: comercio.comercio_id },
    });

    return {
      mensaje: 'Registro completado. Su cuenta está pendiente de activación.',
      comercio: {
        comercio_id: comercio.comercio_id,
        nombre: comercio.nombre,
        estado: comercio.estado,
      },
    };
  }

  async getProfile(usuarioId: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { usuario_id: usuarioId },
      include: { 
        rol: true, 
        comercio: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { pass, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { 
      username: user?.correo || user?.user, 
      sub: user?.usuario_id,
      rol: user?.rol?.nombre,
      comercio_id: user?.comercio_id
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        usuario_id: user?.usuario_id,
        nombre: user?.nombre,
        apellido: user?.apellido,
        user: user?.user || user?.correo,
        rol: user?.rol?.nombre,
        comercio_id: user?.comercio_id
      },
    };
  }
}
