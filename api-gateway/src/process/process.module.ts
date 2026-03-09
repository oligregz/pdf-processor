import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { ProcessHistory } from './entities/process-history.entity';
import { QueueState } from './entities/queue-state.entity';
import { ErrorLog, ErrorLogSchema } from './schemas/error-log.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessHistory, QueueState]),
    MongooseModule.forFeature([{ name: ErrorLog.name, schema: ErrorLogSchema }]),
  ],
  providers: [ProcessService],
  controllers: [ProcessController],
})
export class ProcessModule {}