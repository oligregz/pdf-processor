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
		logger.info("Preparing to send a completion HTML email to: {}", toEmail);

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
							"<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;'>" +
							"  <table width='100%%' border='0' cellspacing='0' cellpadding='0'>" +
							"    <tr>" +
							"      <td align='center' style='padding: 20px 0;'>" +
							"        <table width='600' border='0' cellspacing='0' cellpadding='0' style='background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>"
							+
							"          <tr>" +
							"            <td align='center'>" +
							"              <h2 style='color: #333;'>Good news!</h2>" +
							"              <p style='color: #666; font-size: 16px; line-height: 1.5;'>" +
							"                Your PDF file <strong>%s</strong> has been successfully converted to text." +
							"              </p>" +
							"              <p style='color: #666; font-size: 16px; margin-bottom: 30px;'>" +
							"                Click the button below to download your processed file:" +
							"              </p>" +
							"              <a href='%s' style='background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;'>"
							+
							"                Download your file" +
							"              </a>" +
							"              <p style='color: #999; font-size: 12px; margin-top: 40px;'>" +
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

			helper.setText(htmlContent, true); // O 'true' indica que o conteúdo é HTML

			mailSender.send(message);
			logger.info("HTML Email sent successfully to: {}", toEmail);

		} catch (MessagingException e) {
			logger.error("Failed to create or send email to {}: {}", toEmail, e.getMessage());
		}
	}
}