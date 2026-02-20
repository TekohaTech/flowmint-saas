import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

  async validateGoogleUser(googleUser: any) {
    const { email, googleId, firstName, lastName } = googleUser;

    // 1. Buscar si el usuario ya existe por correo
    let user = await this.prisma.usuario.findFirst({
      where: { correo: email },
      include: { rol: true, comercio: true },
    });

    // 2. Si no existe, es un NUEVO COMERCIO (SaaS Registration)
    if (!user) {
      // Crear Comercio Inactivo
      const nuevoComercio = await this.prisma.comercio.create({
        data: {
          nombre: `Negocio de ${firstName}`,
          activo: false,
        },
      });

      // Crear Usuario Dueño
      user = await this.prisma.usuario.create({
        data: {
          correo: email,
          googleId: googleId,
          nombre: firstName,
          apellido: lastName,
          rol_id: 2, // DUENO
          comercio_id: nuevoComercio.comercio_id,
          estado: 'A',
        },
        include: { rol: true, comercio: true },
      });
    } else {
      // Si existe pero no tenía googleId, lo vinculamos
      if (!user.googleId) {
        user = await this.prisma.usuario.update({
          where: { usuario_id: user.usuario_id },
          data: { googleId: googleId } as any,
          include: { rol: true, comercio: true },
        });
      }
      
      // Validar si el comercio está activo (excepto SuperAdmin)
      if (user && user.rol?.nombre !== 'SUPERADMIN') {
        if (!user.comercio || !user.comercio.activo) {
          throw new UnauthorizedException('Tu comercio se encuentra inactivo. Contacta al administrador.');
        }
      }
    }

    return user;
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
