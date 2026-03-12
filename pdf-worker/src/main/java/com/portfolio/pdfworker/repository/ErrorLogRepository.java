package com.portfolio.pdfworker.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.pdfworker.model.ErrorLog;

@Repository
public interface ErrorLogRepository extends MongoRepository<ErrorLog, String> {
}