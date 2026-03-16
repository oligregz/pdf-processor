package com.portfolio.pdfworker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.portfolio.pdfworker.repository.jpa")
public class PdfWorkerApplication {

	public static void main(String[] args) {
		SpringApplication.run(PdfWorkerApplication.class, args);
	}

}
