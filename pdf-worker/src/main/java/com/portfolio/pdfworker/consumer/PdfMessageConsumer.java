package com.portfolio.pdfworker.consumer;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.portfolio.pdfworker.dto.PdfUploadedEvent;
import com.portfolio.pdfworker.messaging.RabbitMQConstants;
import com.portfolio.pdfworker.service.DatabaseService;
import com.portfolio.pdfworker.service.PdfProcessorService;
import com.rabbitmq.client.Channel;

@Component
public class PdfMessageConsumer {

	private static final Logger logger = LoggerFactory.getLogger(PdfMessageConsumer.class);
	private static final int MAX_RETRIES = 3;

	private final RabbitTemplate rabbitTemplate;
	private final PdfProcessorService pdfProcessorService;
	private final DatabaseService databaseService;

	public PdfMessageConsumer(
			RabbitTemplate rabbitTemplate,
			PdfProcessorService pdfProcessorService,
			DatabaseService databaseService) {
		this.rabbitTemplate = rabbitTemplate;
		this.pdfProcessorService = pdfProcessorService;
		this.databaseService = databaseService;
	}

	@RabbitListener(queues = RabbitMQConstants.Queues.PROCESS)
	public void receiveMessage(PdfUploadedEvent event,
			Message message,
			Channel channel,
			@Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws IOException {

		String correlationId = event.data().correlationId();
		logger.info("Received message for CorrelationID: {}", correlationId);

		try {
			long retryCount = getRetryCount(message);

			if (retryCount >= MAX_RETRIES) {
				logger.error("Max retries exceeded for CorrelationID: {}. Routing to DLQ.", correlationId);
				routeToDeadLetterQueue(message, event);
				channel.basicAck(deliveryTag, false);
				return;
			}

			pdfProcessorService.processPdf(event);

			logger.info("Processing successful for CorrelationID: {}", correlationId);

			channel.basicAck(deliveryTag, false);

		} catch (Exception e) {
			logger.warn("Error processing CorrelationID: {}. Routing to Wait Queue for retry.", correlationId, e);
			channel.basicReject(deliveryTag, false);
		}
	}

	private long getRetryCount(Message message) {
		List<Map<String, ?>> xDeathHeader = message.getMessageProperties().getXDeathHeader();
		if (xDeathHeader != null && !xDeathHeader.isEmpty()) {
			Long count = (Long) xDeathHeader.get(0).get("count");
			return count != null ? count : 0;
		}
		return 0;
	}

	private void routeToDeadLetterQueue(Message message, PdfUploadedEvent event) {
		String correlationId = event.data().correlationId();
		String exceptionMessage = "Max retries exceeded for message.";
		String stackTrace = "Message rejected after multiple reprocessing attempts (Wait Queue -> Main Queue).";

		rabbitTemplate.send(
				RabbitMQConstants.Exchange.PDF,
				RabbitMQConstants.Routing.DLQ,
				message);

		databaseService.failProcessing(correlationId, exceptionMessage, stackTrace);
	}
}