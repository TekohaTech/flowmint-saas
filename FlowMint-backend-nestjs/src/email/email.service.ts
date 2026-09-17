import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly brevoApiKey: string | undefined;
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    this.brevoApiKey = this.configService.get<string>('BREVO_API_KEY');

    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = Number(this.configService.get<string>('SMTP_PORT'));

    if (this.brevoApiKey) {
      // Brevo HTTP API (HTTPS 443). Required on hosts that block outbound
      // SMTP ports, e.g. Render free tier blocks 25, 465 and 587.
      this.logger.log('Email transport: Brevo HTTP API');
    } else if (smtpHost) {
      this.logger.log(`Email transport: SMTP ${smtpHost}:${smtpPort}`);
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });
    } else {
      this.logger.warn(
        'No email transport configured (set BREVO_API_KEY or SMTP_HOST). Emails will not be sent.',
      );
    }
  }

  private resolveFromEmail(): string {
    return (
      this.configService.get<string>('EMAIL_FROM') ||
      this.configService.get<string>('SMTP_USER') ||
      ''
    );
  }

  private async send(payload: EmailPayload): Promise<void> {
    const fromEmail = this.resolveFromEmail();

    if (!fromEmail) {
      this.logger.error('EMAIL_FROM is not configured. Email not sent.');
      return;
    }

    if (this.brevoApiKey) {
      await this.sendViaBrevoApi(payload, fromEmail);
      return;
    }

    if (this.transporter) {
      await this.transporter.sendMail({
        from: `"FlowMint" <${fromEmail}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
      return;
    }

    this.logger.warn('No email transport configured. Email not sent.');
  }

  private async sendViaBrevoApi(payload: EmailPayload, fromEmail: string): Promise<void> {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': this.brevoApiKey as string,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'FlowMint', email: fromEmail },
        to: [{ email: payload.to }],
        subject: payload.subject,
        htmlContent: payload.html,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Brevo API responded ${response.status}: ${errorBody}`);
    }
  }

  async sendResetPasswordEmail(to: string, resetUrl: string) {
    const html = `
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
      `;

    try {
      await this.send({
        to,
        subject: 'Recuperación de contraseña - FlowMint',
        html,
      });
      this.logger.log('Reset password email sent successfully');
    } catch (error) {
      this.logger.error(`Error sending reset password email: ${error.message}`);
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verificar-email?token=${token}`;

    const html = `
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
      `;

    try {
      await this.send({
        to,
        subject: 'Verifica tu correo electrónico - FlowMint',
        html,
      });
      this.logger.log('Verification email sent successfully');
    } catch (error) {
      this.logger.error(`Error sending verification email: ${error.message}`);
    }
  }
}
