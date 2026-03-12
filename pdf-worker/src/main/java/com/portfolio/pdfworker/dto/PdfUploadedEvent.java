package com.portfolio.pdfworker.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PdfUploadedEvent(
		String correlationId,
		String userId,
		String storagePath) {
}