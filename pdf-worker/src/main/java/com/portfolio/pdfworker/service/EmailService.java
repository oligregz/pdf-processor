package com.portfolio.pdfworker.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

	private final JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String fromEmail;

	public EmailService(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	public void sendCompletionEmail(String toEmail, String originalFileName, String txtFileUrl) {
		logger.info("Preparing to successfully send an email to: {}", toEmail);

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(fromEmail);
		message.setTo(toEmail);
		message.setSubject("Your PDF has been successfully processed!");

		String body = String.format(
				"Hi!\n\n" +
						"We are pleased to inform you that the processing of your file '%s' has been completed.\n\n" +
						"The extracted text was securely stored in our cloud storage.\n" +
						"File path: %s\n\n" +
						"Thank you for using our system!",
				originalFileName, txtFileUrl);

		message.setText(body);

		try {
			mailSender.send(message);
			logger.info("Email sent successfully to: {}", toEmail);
		} catch (Exception e) {
			logger.error("Failed to send email to {}: {}", toEmail, e.getMessage());
		}
	}
}