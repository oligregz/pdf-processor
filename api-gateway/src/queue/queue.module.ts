import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { RabbitMQ } from './rabbitmq.constants';
import { QueueController } from './queue.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: RabbitMQ.Queues.PROCESS,
            queueOptions: {
              durable: true,
              arguments: RabbitMQ.QueueArguments.PROCESS_DLQ,
            },
          },
        }),
      },
    ]),
    EventsModule,
  ],
  providers: [QueueService],
  exports: [QueueService],
  controllers: [QueueController],
})
export class QueueModule {}
