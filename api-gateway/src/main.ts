import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SocketIoConfigAdapter } from './common/utils/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('API Gateway');
  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new SocketIoConfigAdapter(app, configService));

  const corsOrigins = configService.get<string[]>('CORS_ORIGINS') ?? [];
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('PDF Processor API')
    .setDescription(
      'API Gateway for asynchronous sending and processing of PDFs using RabbitMQ and Spring Boot.',
    )
    .setVersion('1.2')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const rabbitMqUrl = configService.getOrThrow<string>('RABBITMQ_URL');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'pdf.completed.queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  let appUrl = await app.getUrl();
  if (appUrl.includes('[::1]')) {
    appUrl = appUrl.replace('[::1]', 'localhost');
  }

  logger.log(`🚀 API running on: ${appUrl}`);
  logger.log(`📚 Swagger at: ${appUrl}/api/docs`);
  logger.log(`🛡️ CORS enabled for: ${corsOrigins.join(' | ')}`);
  logger.log(`🔌 WebSocket Adapter registered`);
  logger.log(
    `🐰 RabbitMQ Microservice Consumer listening on pdf.completed.queue`,
  );
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error('Application failed to start', error);
  process.exit(1);
});
