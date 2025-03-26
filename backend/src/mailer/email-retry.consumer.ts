import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { MailerService } from './mailer.service';
import * as amqp from 'amqplib';

@Injectable()
export class EmailRetryConsumer implements OnModuleInit {
  private readonly logger = new Logger(EmailRetryConsumer.name);

  constructor(
    @Inject('NOTIFICATION_SERVICE') private rabbitClient: ClientProxy,
    private mailerService: MailerService,
  ) {}

  async onModuleInit() {
    await this.processPendingMessages();
  }

  private async processPendingMessages() {
    try {
      const connection = await amqp.connect('amqp://localhost:5672');
      const channel = await connection.createChannel();
      
      await channel.assertQueue('email_retry_queue', { durable: true });
      const { messageCount } = await channel.checkQueue('email_retry_queue');
      
      if (messageCount > 0) {
        this.logger.log(`Encontrados ${messageCount} mensajes pendientes en cola`);
        
        channel.consume('email_retry_queue', async (msg) => {
          if (msg) {
              try {
                  const payload = JSON.parse(msg.content.toString());
                  // Asegurarnos de extraer correctamente los datos
                  const message = payload.data || payload;
                  
                  if (!message.email) {
                      throw new Error('Email no definido en el mensaje');
                  }
  
                  await this.mailerService.sendPasswordResetEmail(
                      message.email,
                      message.username,
                      message.token,
                      message.attempt || 1
                  );
                  channel.ack(msg);
              } catch (error) {
                  this.logger.error('Error procesando mensaje pendiente:', error);
                  channel.nack(msg, false, false);
              }
            }
        });
      }
    } catch (error) {
      this.logger.error('Error al procesar mensajes pendientes:', error);
    }
  }

  @EventPattern('email_retry_queue')
  async handleQueuedMessage(payload: any) {
    try {
        // Extraemos correctamente los datos del payload NestJS
        const message = payload.data || payload;
        
        if (!message.email || !message.token) {
            this.logger.error('Mensaje inválido recibido:', message);
            return;
        }

        this.logger.log(`Procesando reintento para ${message.email}`);
        
        await this.mailerService.sendPasswordResetEmail(
            message.email,
            message.username,
            message.token,
            message.attempt || 1
        );
      } catch (error) {
          this.logger.error('Error procesando mensaje:', error);
      }
  }
}