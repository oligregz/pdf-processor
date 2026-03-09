import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

async function bootstrap() {
  const env = dotenv.config();
  dotenvExpand.expand(env);

  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();