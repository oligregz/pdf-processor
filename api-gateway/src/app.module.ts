import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProcessModule } from './process/process.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [AuthModule, ProcessModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
