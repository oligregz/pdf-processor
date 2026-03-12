package com.portfolio.pdfworker.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.pdfworker.model.ProcessHistory;

@Repository
public interface ProcessHistoryRepository extends JpaRepository<ProcessHistory, UUID> {
	Optional<ProcessHistory> findByCorrelationId(String correlationId);
}