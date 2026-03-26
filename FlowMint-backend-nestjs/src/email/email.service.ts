import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE') || false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verificar-email?token=${token}`;

    const mailOptions = {
      from: `"FlowMint" <${this.configService.get<string>('SMTP_USER')}>`,
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
      if (process.env.NODE_ENV !== 'production') {
        console.log('--- SIMULACIÓN DE ENVÍO DE EMAIL ---');
        console.log(`Para: ${to}`);
        console.log(`URL de verificación: ${verificationUrl}`);
        console.log('------------------------------------');
        return;
      }
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error enviando email:', error);
      // No lanzamos error en dev para no bloquear el flujo
      if (process.env.NODE_ENV === 'production') throw error;
    }
  }
}
