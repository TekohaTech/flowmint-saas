import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = Number(this.configService.get<string>('SMTP_PORT'));
    const smtpUser = this.configService.get<string>('SMTP_USER');
    if (smtpHost) {
      console.log(`[EmailService] Creando transporter: ${smtpHost}:${smtpPort} user=${smtpUser}`);
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        auth: {
          user: smtpUser,
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });
    } else {
      console.warn('[EmailService] SMTP_HOST no configurado');
    }
  }

  async sendResetPasswordEmail(to: string, resetUrl: string) {
    if (!this.transporter) {
      console.warn('⚠️ SMTP no configurado. Email de recuperación no enviado.');
      return;
    }

    const fromEmail = this.configService.get<string>('EMAIL_FROM') || this.configService.get<string>('SMTP_USER');
    console.log(`[EmailService] Enviando email a: ${to} desde: ${fromEmail}`);

    const mailOptions = {
      from: `"FlowMint" <${fromEmail}>`,
      to,
      subject: 'Recuperación de contraseña - FlowMint',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #16f2b3; text-align: center;">Recuperación de contraseña</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en FlowMint.</p>
          <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #16f2b3; color: #1a1a2e; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer contraseña</a>
          </div>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px;">Este enlace expirará en 15 minutos.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">Si no solicitaste este cambio, ignorá este mensaje.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('[EmailService] Email enviado exitosamente a:', to);
    } catch (error) {
      console.error('[EmailService] Error enviando email:', error.message);
      console.error('[EmailService] Stack:', error.stack);
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verificar-email?token=${token}`;

    if (!this.transporter) {
      console.warn('⚠️ SMTP no configurado. Email de verificación no enviado. Token:', token.substring(0, 8) + '...');
      return;
    }

    const fromEmail = this.configService.get<string>('EMAIL_FROM') || this.configService.get<string>('SMTP_USER');

    const mailOptions = {
      from: `"FlowMint" <${fromEmail}>`,
      to,
      subject: 'Verifica tu correo electrónico - FlowMint',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #16f2b3; text-align: center;">¡Bienvenido a FlowMint!</h2>
          <p>Gracias por registrarte. Para comenzar a usar el sistema, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #16f2b3; color: #1a1a2e; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar mi cuenta</a>
          </div>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">Este enlace expirará en 24 horas.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('[EmailService] Email de verificación enviado a:', to);
    } catch (error) {
      console.error('[EmailService] Error enviando verificación:', error.message);
    }
  }
}
