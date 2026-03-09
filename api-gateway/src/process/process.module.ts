import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { ProcessHistory } from './entities/process-history.entity';
import { QueueState } from './entities/queue-state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessHistory, QueueState])],
  providers: [ProcessService],
  controllers: [ProcessController],
})
export class ProcessModule {}