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

import com.portfolio.pdfworker.messaging.RabbitMQConstants;

@Configuration
public class RabbitMQConfig {

	@Bean
	public MessageConverter jsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	@Bean
	public DirectExchange mainExchange() {
		return new DirectExchange(RabbitMQConstants.Exchange.PDF);
	}

	@Bean
	public Queue mainQueue() {
		return QueueBuilder.durable(RabbitMQConstants.Queues.PROCESS)
				.withArgument(
						RabbitMQConstants.Arguments.DEAD_LETTER_EXCHANGE,
						RabbitMQConstants.Exchange.PDF)
				.withArgument(
						RabbitMQConstants.Arguments.DEAD_LETTER_ROUTING_KEY,
						RabbitMQConstants.Routing.WAIT)
				.build();
	}

	@Bean
	public Binding mainBinding() {
		return BindingBuilder
				.bind(mainQueue())
				.to(mainExchange())
				.with(RabbitMQConstants.Routing.UPLOADED);
	}

	@Bean
	public Queue waitQueue() {
		return QueueBuilder.durable(RabbitMQConstants.Queues.WAIT)
				.withArgument(
						RabbitMQConstants.Arguments.DEAD_LETTER_EXCHANGE,
						RabbitMQConstants.Exchange.PDF)
				.withArgument(
						RabbitMQConstants.Arguments.DEAD_LETTER_ROUTING_KEY,
						RabbitMQConstants.Routing.UPLOADED)
				.withArgument(
						RabbitMQConstants.Arguments.MESSAGE_TTL,
						5000)
				.build();
	}

	@Bean
	public Binding waitBinding() {
		return BindingBuilder
				.bind(waitQueue())
				.to(mainExchange())
				.with(RabbitMQConstants.Routing.WAIT);
	}

	@Bean
	public Queue deadLetterQueue() {
		return QueueBuilder
				.durable(RabbitMQConstants.Queues.DLQ)
				.build();
	}

	@Bean
	public Binding deadLetterBinding() {
		return BindingBuilder
				.bind(deadLetterQueue())
				.to(mainExchange())
				.with(RabbitMQConstants.Routing.DLQ);
	}
}