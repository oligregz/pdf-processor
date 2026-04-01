import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
