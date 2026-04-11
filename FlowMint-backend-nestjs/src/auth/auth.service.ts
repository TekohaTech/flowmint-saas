import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CompletarRegistroDto } from './dto/completar-registro.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

const REGISTRO_IP_BLOQUEO_HORAS = 2;

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private emailService: EmailService,
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

  async register(dto: RegisterDto, ip: string) {
    const { nombre, apellido, user, correo, pass, dni, nombreComercio, categoria, direccion, telefono } = dto;

    const usuarioExistente = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { user },
          { correo },
        ],
      },
    });

    if (usuarioExistente) {
      if (usuarioExistente.user === user) {
        throw new BadRequestException('El nombre de usuario ya está en uso');
      }
      if (usuarioExistente.correo === correo) {
        throw new BadRequestException('El correo electrónico ya está registrado');
      }
    }

    const controlIP = await this.verificarControlIP(ip, correo);
    if (!controlIP.puedeRegistrar && process.env.NODE_ENV === 'production') {
      const minutosRestantes = controlIP.minutosRestantes;
      throw new HttpException(
        `Ya realizaste un intento de registro. Intenta nuevamente en ${minutosRestantes} minutos`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const nuevoComercio = await this.prisma.comercio.create({
      data: {
        nombre: nombreComercio,
        categoria,
        direccion: direccion || null,
        telefono: telefono || null,
        email: correo,
        activo: false,
        estado: 'pendiente',
        dueno_nombre: nombre,
        dueno_apellido: apellido,
        dueno_email: correo,
      },
    });

    const tokenVerificacion = crypto.randomBytes(32).toString('hex');

    const nuevoUsuario = await this.prisma.usuario.create({
      data: {
        nombre,
        apellido,
        user,
        correo,
        pass: hashedPassword,
        dni: dni || null,
        rol_id: 2,
        estado: 'A',
        comercio_id: nuevoComercio.comercio_id,
        token_verificacion: tokenVerificacion,
        email_verificado: false,
      },
    });

    await this.prisma.registroIP.create({
      data: {
        ip,
        correo,
      },
    });

    // Enviar email de verificación (fallo silencioso si SMTP no está configurado)
    try {
      await this.emailService.sendVerificationEmail(correo, tokenVerificacion);
    } catch (emailError) {
      console.warn('⚠️ Email de verificación no enviado (SMTP no configurado). El usuario puede verificar desde el panel.');
    }

    return {
      message: 'Tu comercio ha sido creado exitosamente. Está pendiente de activación. Te notificaremos cuando esté listo. Se ha enviado un correo de verificación.',
      comercio: {
        comercio_id: nuevoComercio.comercio_id,
        nombre: nuevoComercio.nombre,
        estado: nuevoComercio.estado,
      },
      usuario: {
        usuario_id: nuevoUsuario.usuario_id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        user: nuevoUsuario.user,
        correo: nuevoUsuario.correo,
        rol_id: nuevoUsuario.rol_id,
        email_verificado: nuevoUsuario.email_verificado,
      },
    };
  }

  async verificarEmail(token: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { token_verificacion: token },
    });

    if (!usuario) {
      throw new BadRequestException('Token de verificación inválido o expirado.');
    }

    await this.prisma.usuario.update({
      where: { usuario_id: usuario.usuario_id },
      data: {
        email_verificado: true,
        token_verificacion: null,
      },
    });

    return { message: 'Email verificado exitosamente. Ya puedes iniciar sesión.' };
  }

  private async verificarControlIP(ip: string, correo: string) {
    const haceDosHoras = new Date();
    haceDosHoras.setHours(haceDosHoras.getHours() - REGISTRO_IP_BLOQUEO_HORAS);

    const ultimoRegistroIP = await this.prisma.registroIP.findFirst({
      where: {
        ip,
        intento: { gte: haceDosHoras },
      },
      orderBy: { intento: 'desc' },
    });

    if (ultimoRegistroIP) {
      const tiempoTranscurrido = Date.now() - ultimoRegistroIP.intento.getTime();
      const dosHorasEnMs = REGISTRO_IP_BLOQUEO_HORAS * 60 * 60 * 1000;
      const minutosRestantes = Math.ceil((dosHorasEnMs - tiempoTranscurrido) / (1000 * 60));
      
      return {
        puedeRegistrar: false,
        minutosRestantes,
      };
    }

    const ultimoRegistroCorreo = await this.prisma.registroIP.findFirst({
      where: {
        correo,
        intento: { gte: haceDosHoras },
      },
      orderBy: { intento: 'desc' },
    });

    if (ultimoRegistroCorreo) {
      const tiempoTranscurrido = Date.now() - ultimoRegistroCorreo.intento.getTime();
      const dosHorasEnMs = REGISTRO_IP_BLOQUEO_HORAS * 60 * 60 * 1000;
      const minutosRestantes = Math.ceil((dosHorasEnMs - tiempoTranscurrido) / (1000 * 60));
      
      return {
        puedeRegistrar: false,
        minutosRestantes,
      };
    }

    return { puedeRegistrar: true, minutosRestantes: 0 };
  }
}
