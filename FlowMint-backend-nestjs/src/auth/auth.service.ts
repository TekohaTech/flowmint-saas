import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus, GoneException, Logger } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CompletarRegistroDto } from './dto/completar-registro.dto';
import { RegisterDto } from './dto/register.dto';
import { ActivarPinDto } from './dto/activar-pin.dto';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

const REGISTRO_IP_BLOQUEO_HORAS = 2;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
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

    const { pass, pin_hash, pin_expiracion, ...result } = user;
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

  /**
   * Employee self-activation: validate the 6-digit PIN, set their own
   * password, and sign them in immediately (same JWT flow as login).
   */
  async activarPin(dto: ActivarPinDto) {
    const activatedUser = await this.usuariosService.activarConPin(
      dto.user,
      dto.pin,
      dto.pass,
    );

    // The PIN must never be returned or logged after activation
    const { pin, ...safeUser } = activatedUser as any;

    const payload = {
      username: safeUser?.correo || safeUser?.user,
      sub: safeUser?.usuario_id,
      rol: safeUser?.rol?.nombre,
      comercio_id: safeUser?.comercio_id,
    };

    this.logger.log(`Employee activated via PIN: usuario_id=${safeUser?.usuario_id}`);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        usuario_id: safeUser?.usuario_id,
        nombre: safeUser?.nombre,
        apellido: safeUser?.apellido,
        user: safeUser?.user || safeUser?.correo,
        rol: safeUser?.rol?.nombre,
        comercio_id: safeUser?.comercio_id,
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
      this.logger.warn('Verification email not sent (SMTP not configured). User can verify from the panel.');
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

  async forgotPassword(correo: string) {
    const user = await this.prisma.usuario.findFirst({
      where: { correo, estado: 'A' },
    });

    // Log only the fact of the lookup, never the email or whether user exists (prevents user enumeration)
    this.logger.debug('[forgotPassword] Password reset requested');

    if (!user) {
      return { message: 'Si el correo existe, recibirás un enlace de recuperación.' };
    }

    const resetToken = this.jwtService.sign(
      {
        sub: user.usuario_id,
        type: 'reset_password',
        // Binds the token to the current password hash: once the password
        // changes, this token (and any other issued before) becomes invalid.
        fph: this.fingerprintPassword(user.pass),
      },
      { expiresIn: '15m' },
    );

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await this.emailService.sendResetPasswordEmail(correo, resetUrl, user.nombre);

    return { message: 'Si el correo existe, recibirás un enlace de recuperación.' };
  }

  async resetPassword(token: string, newPass: string) {
    let payload: { sub: number; type: string; fph?: string };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('El enlace de recuperación es inválido o expiró.');
    }

    if (payload.type !== 'reset_password') {
      throw new BadRequestException('Token inválido.');
    }

    const user = await this.prisma.usuario.findUnique({
      where: { usuario_id: payload.sub },
      select: { usuario_id: true, correo: true, nombre: true, pass: true },
    });

    if (!user) {
      throw new BadRequestException('El enlace de recuperación es inválido o expiró.');
    }

    // Single-use enforcement: the token stays valid only while the password
    // hash is unchanged. Using it once changes the hash and burns the token,
    // so it cannot be replayed inside the 15 minute window.
    if (this.fingerprintPassword(user.pass) !== payload.fph) {
      throw new BadRequestException('El enlace de recuperación es inválido o expiró.');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    await this.prisma.usuario.update({
      where: { usuario_id: user.usuario_id },
      data: { pass: hashedPassword },
    });

    if (user.correo) {
      await this.emailService.sendPasswordChangedEmail(user.correo, user.nombre);
    }

    return { message: 'Contraseña actualizada exitosamente. Ya podés iniciar sesión.' };
  }

  /**
   * Stable, non-reversible fingerprint of the current password hash.
   * Embedded in reset tokens so they self-invalidate after use.
   */
  private fingerprintPassword(passHash: string | null): string {
    return crypto
      .createHash('sha256')
      .update(passHash ?? '')
      .digest('hex')
      .slice(0, 16);
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
