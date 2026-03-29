import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { ProcessHistory } from './entities/process-history.entity';
import { QueueState } from './entities/queue-state.entity';
import { ErrorLog, ErrorLogSchema } from './schemas/error-log.schema';
import { StorageModule } from 'src/storage/storage.module';
import { AuthModule } from 'src/auth/auth.module';
import { QueueModule } from 'src/queue/queue.module';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessHistory, QueueState]),
    MongooseModule.forFeature([
      { name: ErrorLog.name, schema: ErrorLogSchema },
    ]),
    AuthModule,
    StorageModule,
    QueueModule,
  ],
  providers: [ProcessService, EventsGateway],
  controllers: [ProcessController],
})
export class ProcessModule {}
