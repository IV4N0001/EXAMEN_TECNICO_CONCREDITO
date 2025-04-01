import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailRetryConsumer } from './email-retry.consumer';
import { AMQP_PASS, AMQP_USER } from 'src/config/amqp.config';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'NOTIFICATION_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [`amqp://${AMQP_USER}:${AMQP_PASS}@localhost:5672`,],
                    queue: 'email_retry_queue',
                    queueOptions: {
                        durable: true, // Cola persistente
                      },
                    prefetchCount: 1, // Procesar un mensaje a la vez
                    serializer: {
                        serialize(value) {
                          return value; // Envía el payload directamente
                        }
                    }
                }
            }
        ])
    ],
    providers: [MailerService, EmailRetryConsumer],
    exports: [MailerService]
})
export class MailerModule {}