package com.portfolio.pdfworker.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

	public static final String MAIN_QUEUE = "pdf.process.queue";
	public static final String MAIN_EXCHANGE = "pdf.exchange";
	public static final String ROUTING_KEY = "pdf.uploaded";

	public static final String WAIT_QUEUE = "pdf.wait.queue";

	public static final String DEAD_LETTER_QUEUE = "pdf.dlq.queue";

	@Bean
	public MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	@Bean
	public DirectExchange mainExchange() {
		return new DirectExchange(MAIN_EXCHANGE);
	}

	@Bean
	public Queue mainQueue() {
		return QueueBuilder.durable(MAIN_QUEUE)
				.withArgument("x-dead-letter-exchange", MAIN_EXCHANGE)
				.withArgument("x-dead-letter-routing-key", "pdf.wait")
				.build();
	}

	@Bean
	public Binding mainBinding() {
		return BindingBuilder.bind(mainQueue()).to(mainExchange()).with(ROUTING_KEY);
	}

	@Bean
	public Queue waitQueue() {
		return QueueBuilder.durable(WAIT_QUEUE)
				.withArgument("x-dead-letter-exchange", MAIN_EXCHANGE)
				.withArgument("x-dead-letter-routing-key", ROUTING_KEY)
				.withArgument("x-message-ttl", 5000)
				.build();
	}

	@Bean
	public Binding waitBinding() {
		return BindingBuilder.bind(waitQueue()).to(mainExchange()).with("pdf.wait");
	}

	@Bean
	public Queue deadLetterQueue() {
		return QueueBuilder.durable(DEAD_LETTER_QUEUE).build();
	}

	@Bean
	public Binding deadLetterBinding() {
		return BindingBuilder.bind(deadLetterQueue()).to(mainExchange()).with("pdf.dlq");
	}
}