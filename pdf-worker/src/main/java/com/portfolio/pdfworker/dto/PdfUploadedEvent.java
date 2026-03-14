package com.portfolio.pdfworker.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PdfUploadedEvent(
		String pattern,
		Payload data) {
	@JsonIgnoreProperties(ignoreUnknown = true)
	public record Payload(
			String correlationId,
			String userId,
			String email,
			String originalFileName,
			String storagePath) {
	}
}