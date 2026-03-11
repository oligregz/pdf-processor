import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IPdfUploadedEventPayload } from 'src/common/interafces/queue.interface';
@Injectable()
export class QueueService {
	private readonly logger = new Logger(QueueService.name);

	constructor(
		@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
	) { }

	publishPdfUploadedEvent(payload: IPdfUploadedEventPayload): void {
		this.client.emit('pdf.uploaded', payload);
		this.logger.log(`Event 'pdf.uploaded' published for CorrelationID: ${payload.correlationId}`);
	}
}