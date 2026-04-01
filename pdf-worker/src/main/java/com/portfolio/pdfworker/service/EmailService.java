package com.portfolio.pdfworker.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

	private final JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String fromEmail;

	@Value("${CORS_ORIGINS:http://localhost:4200}")
	private String corsOrigins;

	public EmailService(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}

	public void sendCompletionEmail(String toEmail, String originalFileName, String correlationId) {
		logger.info("Preparing to send a dark-themed completion HTML email to: {}", toEmail);

		String baseUrl = corsOrigins.split(",")[0].trim();
		String downloadLink = String.format("%s/download/%s", baseUrl, correlationId);

		MimeMessage message = mailSender.createMimeMessage();

		try {
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setFrom(fromEmail);
			helper.setTo(toEmail);
			helper.setSubject("Your PDF has been successfully processed!");

			String htmlContent = String.format(
					"<html>" +
							"<body style='font-family: \"Segoe UI\", Arial, sans-serif; background-color: #0A0A0A; margin: 0; padding: 0;'>"
							+
							"  <table width='100%%' border='0' cellspacing='0' cellpadding='0' style='background-color: #0A0A0A;'>" +
							"    <tr>" +
							"      <td align='center' style='padding: 40px 20px;'>" +
							"        <table width='600' border='0' cellspacing='0' cellpadding='0' style='background-color: #1A1616; padding: 40px; border-radius: 12px; border: 1px solid #2d2d2d;'>"
							+
							"          <tr>" +
							"            <td align='center'>" +
							"              <h2 style='color: #F3F4F6; font-size: 24px; margin-bottom: 10px; font-weight: bold;'>Document Ready!</h2>"
							+
							"              <p style='color: #9CA3AF; font-size: 16px; line-height: 1.6; margin-bottom: 20px;'>" +
							"                Your PDF file <strong style='color: #F3F4F6;'>%s</strong> has been successfully converted to text."
							+
							"              </p>" +
							"              <p style='color: #9CA3AF; font-size: 16px; margin-bottom: 35px;'>" +
							"                Click the button below to download your processed file securely." +
							"              </p>" +
							"              <a href='%s' style='background-color: #C81E1E; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;'>"
							+
							"                Download File" +
							"              </a>" +
							"              <hr style='border: none; border-top: 1px solid #2d2d2d; margin: 40px 0 20px 0;'>" +
							"              <p style='color: #6b7280; font-size: 12px; margin: 0;'>" +
							"                Thank you for using PDF Processor." +
							"              </p>" +
							"            </td>" +
							"          </tr>" +
							"        </table>" +
							"      </td>" +
							"    </tr>" +
							"  </table>" +
							"</body>" +
							"</html>",
					originalFileName, downloadLink);

			helper.setText(htmlContent, true);

			mailSender.send(message);
			logger.info("HTML Email sent successfully to: {}", toEmail);

		} catch (MessagingException e) {
			logger.error("Failed to create or send email to {}: {}", toEmail, e.getMessage());
		}
	}
}