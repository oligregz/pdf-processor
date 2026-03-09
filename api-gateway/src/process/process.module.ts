import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';

@Module({
  providers: [ProcessService],
  controllers: [ProcessController]
})
export class ProcessModule {}
