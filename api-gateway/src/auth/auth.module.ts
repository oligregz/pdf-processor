import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { RateLimit, RateLimitSchema } from './schemas/rate-limit.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{ name: RateLimit.name, schema: RateLimitSchema }]),
  ],
  providers: [AuthService],
  exports: [TypeOrmModule, MongooseModule],
})
export class AuthModule {}