package com.portfolio.pdfworker.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class StorageService {

	private static final Logger logger = LoggerFactory.getLogger(StorageService.class);
	private final S3Client s3Client;

	@Value("${cloudflare.r2.bucket-name}")
	private String bucketName;

	public StorageService(S3Client s3Client) {
		this.s3Client = s3Client;
	}

	public byte[] downloadFile(String fileKey) {
		logger.info("Downloading the R2 file: {}", fileKey);

		GetObjectRequest getObjectRequest = GetObjectRequest.builder()
				.bucket(bucketName)
				.key(fileKey)
				.build();

		ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(getObjectRequest);
		return objectBytes.asByteArray();
	}

	public void uploadTextFile(String fileKey, String content) {
		logger.info("Loading the text file into R2: {}", fileKey);

		PutObjectRequest putObjectRequest = PutObjectRequest.builder()
				.bucket(bucketName)
				.key(fileKey)
				.contentType("text/plain")
				.build();

		s3Client.putObject(putObjectRequest, RequestBody.fromString(content));
	}
}