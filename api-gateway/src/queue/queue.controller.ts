import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventsGateway } from '../events/events.gateway';
import type { IPdfProcessedPayload } from 'src/common/interfaces/queue.interface';

@Controller()
export class QueueController {
  private readonly logger = new Logger(QueueController.name);

  constructor(private readonly eventsGateway: EventsGateway) {}

  @EventPattern('pdf.completed')
  public handlePdfCompleted(@Payload() data: IPdfProcessedPayload): void {
    this.logger.log(
      `[RABBITMQ] File processed successfully: ${data.correlationId}`,
    );

    this.eventsGateway.notifyJobCompleted(data.userId, data.correlationId);
  }

  @EventPattern('pdf.failed')
  public handlePdfFailed(@Payload() data: IPdfProcessedPayload): void {
    this.logger.error(
      `[RABBITMQ] File processing failed: ${data.correlationId}`,
    );

    this.eventsGateway.notifyJobFailed(data.userId);
  }
}
