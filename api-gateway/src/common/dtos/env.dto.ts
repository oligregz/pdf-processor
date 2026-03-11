import {
  IsNumber,
  IsString,
  IsUrl,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EnvironmentVariables {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(65535)
  PORT: number;

  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(65535)
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsUrl({
    require_tld: false,
  	protocols: ['postgres', 'postgresql'],
  })
  POSTGRES_URL: string;

  @IsString()
  MONGO_HOST: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(65535)
  MONGO_PORT: number;

  @IsString()
  MONGO_USER: string;

  @IsString()
  MONGO_PASSWORD: string;

  @IsString()
  MONGO_DB: string;

  @IsString()
  MONGO_AUTH_SOURCE: string;

  @IsUrl({
    require_tld: false,
		protocols: ['mongodb', 'mongodb+srv'],
  })
  MONGO_URL: string;

  @IsString()
  RABBITMQ_HOST: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(65535)
  RABBITMQ_PORT: number;

  @IsString()
  RABBITMQ_USER: string;

  @IsString()
  RABBITMQ_PASSWORD: string;

  @IsUrl({
    require_tld: false,
		protocols: ['amqp', 'amqps'],
  })
  RABBITMQ_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  @Matches(/^\d+[smhd]$/, {
    message:
      'EXPIRATION_TIME_TO_LIVE must follow pattern like 15m, 10s, 2h, 7d',
  })
  EXPIRATION_TIME_TO_LIVE: string;
}