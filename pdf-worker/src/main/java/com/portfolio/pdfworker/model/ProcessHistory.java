package com.portfolio.pdfworker.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "process_history")
public class ProcessHistory {

	@Id
	private UUID id;

	@Column(name = "correlation_id", updatable = false)
	private String correlationId;

	@Column(name = "file_name")
	private String fileName;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private ProcessStatusEnum status;

	@Column(name = "processing_start")
	private OffsetDateTime processingStart;

	@Column(name = "processing_end")
	private OffsetDateTime processingEnd;

	@Column(name = "txt_conversion_start")
	private OffsetDateTime txtConversionStart;

	@Column(name = "txt_conversion_end")
	private OffsetDateTime txtConversionEnd;

	@Column(name = "error_log")
	private String errorLog;

	public String getCorrelationId() {
		return correlationId;
	}

	public void setCorrelationId(String correlationId) {
		this.correlationId = correlationId;
	}

	public ProcessStatusEnum getStatus() {
		return status;
	}

	public void setStatus(ProcessStatusEnum status) {
		this.status = status;
	}

	public OffsetDateTime getProcessingStart() {
		return processingStart;
	}

	public void setProcessingStart(OffsetDateTime processingStart) {
		this.processingStart = processingStart;
	}

	public OffsetDateTime getProcessingEnd() {
		return processingEnd;
	}

	public void setProcessingEnd(OffsetDateTime processingEnd) {
		this.processingEnd = processingEnd;
	}

	public OffsetDateTime getTxtConversionStart() {
		return txtConversionStart;
	}

	public void setTxtConversionStart(OffsetDateTime txtConversionStart) {
		this.txtConversionStart = txtConversionStart;
	}

	public OffsetDateTime getTxtConversionEnd() {
		return txtConversionEnd;
	}

	public void setTxtConversionEnd(OffsetDateTime txtConversionEnd) {
		this.txtConversionEnd = txtConversionEnd;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getErrorLog() {
		return errorLog;
	}

	public void setErrorLog(String errorLog) {
		this.errorLog = errorLog;
	}
}