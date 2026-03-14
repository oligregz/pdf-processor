package com.portfolio.pdfworker.messaging;

public final class RabbitMQConstants {

	private RabbitMQConstants() {
	}

	public static final class Exchange {
		public static final String PDF = "pdf.exchange";
	}

	public static final class Queues {
		public static final String PROCESS = "pdf.process.queue";
		public static final String WAIT = "pdf.wait.queue";
		public static final String DLQ = "pdf.dlq.queue";
	}

	public static final class Routing {
		public static final String UPLOADED = "pdf.uploaded";
		public static final String WAIT = "pdf.wait";
		public static final String DLQ = "pdf.dlq";
	}

	public static final class Arguments {
		public static final String DEAD_LETTER_EXCHANGE = "x-dead-letter-exchange";
		public static final String DEAD_LETTER_ROUTING_KEY = "x-dead-letter-routing-key";
		public static final String MESSAGE_TTL = "x-message-ttl";
	}
}