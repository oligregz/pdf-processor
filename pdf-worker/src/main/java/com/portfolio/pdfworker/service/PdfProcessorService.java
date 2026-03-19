package com.portfolio.pdfworker.service;

import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.portfolio.pdfworker.dto.PdfUploadedEvent;

@Service
public class PdfProcessorService {

	private static final Logger logger = LoggerFactory.getLogger(PdfProcessorService.class);
	private final StorageService storageService;
	private final DatabaseService databaseService;
	private final EmailService emailService;

	public PdfProcessorService(StorageService storageService, DatabaseService databaseService,
			EmailService emailService) {
		this.storageService = storageService;
		this.databaseService = databaseService;
		this.emailService = emailService;
	}

	public void processPdf(PdfUploadedEvent event) throws Exception {
		String pdfKey = event.data().storagePath();
		String correlationId = event.data().correlationId();
		String userEmail = event.data().email();
		String originalFileName = event.data().originalFileName();

		logger.info("Starting processing for CorrelationID: {}", correlationId);
		databaseService.startProcessing(correlationId);

		byte[] pdfBytes = storageService.downloadFile(pdfKey);
		String extractedText = extractTextFromPdf(pdfBytes);
		String txtKey = pdfKey.replace(".pdf", ".txt");

		storageService.uploadTextFile(txtKey, extractedText);

		databaseService.finishProcessing(correlationId);
		logger.info("Text extraction completed and saved in: {}", txtKey);

		emailService.sendCompletionEmail(userEmail, originalFileName, correlationId);
	}

	private String extractTextFromPdf(byte[] pdfBytes) throws IOException {
		try (PDDocument document = Loader.loadPDF(pdfBytes)) {
			PDFTextStripper pdfStripper = new PDFTextStripper();
			return pdfStripper.getText(document);
		}
	}
}