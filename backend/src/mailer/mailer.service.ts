import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as nodemailer from 'nodemailer';
import { USER_GMAIL, USER_PASS } from 'src/config/mailer.config';

@Injectable()
export class MailerService {
  private transporter;
  private readonly logger = new Logger(MailerService.name);
  private readonly MAX_RETRIES = 3;

  constructor(@Inject('NOTIFICATION_SERVICE') private rabbitClient: ClientProxy) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: USER_GMAIL,
        pass: USER_PASS,
      },
      pool: true, // Usar conexión persistente
      maxConnections: 1, // Limitar conexiones simultáneas
    });
  }

  async sendPasswordResetEmail(
    email: string,
    username: string,
    token: string,
    attempt = 1
  ) {

    if (!email || !username || !token) {
        this.logger.error('Campos requeridos faltantes en el payload');
        return { success: false };
    }

    const mailOptions = {
      from: '"Soporte de la App" <ivan.rivera.191202@gmail.com>',
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `
        <h2>Hola ${username}</h2>
        <p>Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
        <p>Token: ${token}</p>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        <p>El enlace expirará en 1 hora.</p>
        <hr>
        <p>Equipo de soporte</p>
      `,
    };

    try {
      // Delay mínimo entre envíos (1 segundo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email enviado con exito a ${email}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error al enviar email a ${email}:`, error.message);
      
      if (attempt < this.MAX_RETRIES) {
        const delay = this.calculateRetryDelay(attempt);
        this.logger.warn(`Programando reintento en ${delay/1000} segundos...`);
        
        // Usamos setTimeout para el delay manual
        setTimeout(() => {
          this.rabbitClient.emit('email_retry_queue', {
            email,
            username,
            token,
            attempt: attempt + 1,
            lastError: error.message,
            timestamp: new Date().toISOString()
          });
        }, delay);
      } else {
        this.logger.error(`Máximo de reintentos alcanzado para ${email}`);
        // Aquí podrías notificar a un administrador
      }
      
      return { success: false };
    }
  }

  private calculateRetryDelay(attempt: number): number {
    // Backoff exponencial: 5s, 20s, 45s (máximo 1 minuto)
    return Math.min(5000 * (attempt ** 2), 60000);
  }
}