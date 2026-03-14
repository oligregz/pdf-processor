package com.portfolio.pdfworker.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "error_logs")
public class ErrorLog {

	@Id
	private String id;

	@Indexed
	private String correlationId;

	private String service;
	private String message;
	private String stackTrace;
	private Instant timestamp;

	public ErrorLog(String correlationId, String service, String message, String stackTrace) {
		this.correlationId = correlationId;
		this.service = service;
		this.message = message;
		this.stackTrace = stackTrace;
		this.timestamp = Instant.now();
	}

	public String getId() {
		return id;
	}

	public String getCorrelationId() {
		return correlationId;
	}

	public String getService() {
		return service;
	}

	public String getMessage() {
		return message;
	}

	public String getStackTrace() {
		return stackTrace;
	}

	public Instant getTimestamp() {
		return timestamp;
	}
}