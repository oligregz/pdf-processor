import {
  IsNumber,
  IsString,
  IsUrl,
  Matches,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { parseCorsOrigins } from '../utils/parse-cors-origins.util';

export class EnvironmentVariables {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(65535)
  PORT: number;

  @Transform(({ value }): string[] => parseCorsOrigins(value))
  @IsArray()
  @IsUrl({ require_tld: false }, { each: true })
  CORS_ORIGINS: string[];

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

  @IsString()
  NEST_POSTGRES_URL: string;

  @IsString()
  JDBC_POSTGRES_URL: string;

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

  @IsString()
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

  @IsString()
  RABBITMQ_URL: string;

  @IsString()
  GMAIL_USER: string;

  @IsString()
  GMAIL_APP_PASS: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  @Matches(/^\d+[smhd]$/, {
    message:
      'EXPIRATION_TIME_TO_LIVE must follow pattern like 15m, 10s, 2h, 7d',
  })
  EXPIRATION_TIME_TO_LIVE: string;

  @IsString()
  CLOUDFLARE_ACCOUNT_ID: string;

  @IsString()
  CLOUDFLARE_R2_ACCESS_KEY: string;

  @IsString()
  CLOUDFLARE_R2_SECRET_KEY: string;

  @IsString()
  CLOUDFLARE_R2_BUCKET_NAME: string;

  @IsUrl({
    require_tld: false,
    protocols: ['https'],
  })
  CLOUDFLARE_R2_BUCKET_URL: string;
}
