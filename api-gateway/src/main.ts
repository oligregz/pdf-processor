import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common'; // <-- 1. Importar o Logger nativo

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('API Gateway');

  const config = new DocumentBuilder()
    .setTitle('PDF Processor API')
    .setDescription('API Gateway para envio e processamento assíncrono de PDFs com RabbitMQ e Spring Boot.')
    .setVersion('1.0')
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
}
bootstrap();