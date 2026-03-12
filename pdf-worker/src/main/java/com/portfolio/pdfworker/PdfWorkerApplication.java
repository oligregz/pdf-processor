package com.portfolio.pdfworker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.portfolio.pdfworker.repository.jpa")
@EnableMongoRepositories(basePackages = "com.portfolio.pdfworker.repository.mongo")
public class PdfWorkerApplication {

	public static void main(String[] args) {
		SpringApplication.run(PdfWorkerApplication.class, args);
	}

}
