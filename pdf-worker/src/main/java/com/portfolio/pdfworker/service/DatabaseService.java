package com.portfolio.pdfworker.service;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portfolio.pdfworker.model.ErrorLog;
import com.portfolio.pdfworker.model.ProcessHistory;
import com.portfolio.pdfworker.model.ProcessStatusEnum;
import com.portfolio.pdfworker.repository.ErrorLogRepository;
import com.portfolio.pdfworker.repository.ProcessHistoryRepository;

@Service
public class DatabaseService {

	private static final Logger logger = LoggerFactory.getLogger(DatabaseService.class);

	private final ProcessHistoryRepository processHistoryRepository;
	private final ErrorLogRepository errorLogRepository;

	public DatabaseService(ProcessHistoryRepository processHistoryRepository, ErrorLogRepository errorLogRepository) {
		this.processHistoryRepository = processHistoryRepository;
		this.errorLogRepository = errorLogRepository;
	}

	@Transactional
	public void startProcessing(String correlationId) {
		Optional<ProcessHistory> historyOpt = processHistoryRepository.findByCorrelationId(correlationId);

		if (historyOpt.isPresent()) {
			ProcessHistory history = historyOpt.get();
			history.setStatus(ProcessStatusEnum.PROCESSING);
			history.setProcessingStart(OffsetDateTime.now());
			history.setTxtConversionStart(OffsetDateTime.now());
			processHistoryRepository.save(history);
			logger.info("Updated state for PROCESSING: {}", correlationId);
		} else {
			logger.warn("No record found in PostgreSQL for CorrelationID: {}", correlationId);
		}
	}

	@Transactional
	public void finishProcessing(String correlationId) {
		Optional<ProcessHistory> historyOpt = processHistoryRepository.findByCorrelationId(correlationId);

		if (historyOpt.isPresent()) {
			ProcessHistory history = historyOpt.get();
			history.setStatus(ProcessStatusEnum.COMPLETED);
			history.setTxtConversionEnd(OffsetDateTime.now());
			history.setProcessingEnd(OffsetDateTime.now());
			processHistoryRepository.save(history);
			logger.info("Updated status to COMPLETED: {}", correlationId);
		}
	}

	@Transactional
	public void failProcessing(String correlationId, String errorMessage, String stackTrace) {
		Optional<ProcessHistory> historyOpt = processHistoryRepository.findByCorrelationId(correlationId);
		if (historyOpt.isPresent()) {
			ProcessHistory history = historyOpt.get();
			history.setStatus(ProcessStatusEnum.FAILED);
			history.setProcessingEnd(OffsetDateTime.now());

			String shortError = errorMessage.length() > 250 ? errorMessage.substring(0, 250) : errorMessage;
			history.setErrorLog(shortError);

			processHistoryRepository.save(history);
		}

		ErrorLog errorLog = new ErrorLog(
				correlationId,
				"pdf-worker-java",
				errorMessage,
				stackTrace);
		errorLogRepository.save(errorLog);
		logger.error("Status updated to FAILED and error log recorded in MongoDB: {}", correlationId);
	}
}