package com.portfolio.pdfworker.config;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

	@Value("${cloudflare.r2.account-id}")
	private String accountId;

	@Value("${cloudflare.r2.access-key}")
	private String accessKey;

	@Value("${cloudflare.r2.secret-key}")
	private String secretKey;

	@Bean
	public S3Client s3Client() {
		String endpointUrl = String.format("https://%s.r2.cloudflarestorage.com", accountId);

		return S3Client.builder()
				.endpointOverride(URI.create(endpointUrl))
				.credentialsProvider(StaticCredentialsProvider.create(
						AwsBasicCredentials.create(accessKey, secretKey)))
				.region(Region.of("auto"))
				.build();
	}
}