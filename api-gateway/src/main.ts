import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('API Gateway');
  const configService = app.get(ConfigService);

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
    .setVersion('1.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  let appUrl = await app.getUrl();

  // Cosmetic treatment: The local IPv6 address [::1] is converted to localhost to make it easier to click in the terminal.
  if (appUrl.includes('[::1]')) {
    appUrl = appUrl.replace('[::1]', 'localhost');
  }

  logger.log(`🚀 Application running successfully on: ${appUrl}`);
  logger.log(`📚 Swagger documentation is available at: ${appUrl}/api/docs`);
  logger.log(`🛡️ CORS enabled for origins: ${corsOrigins.join(' | ')}`);
}
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Application failed to start', error);
  process.exit(1);
});
