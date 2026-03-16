package com.portfolio.pdfworker;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.mongodb.core.MongoTemplate; // <-- IMPORT NOVO
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.portfolio.pdfworker.model.ProcessHistory;
import com.portfolio.pdfworker.model.ProcessStatusEnum;
import com.portfolio.pdfworker.repository.jpa.ProcessHistoryRepository;

@DataJpaTest
@ActiveProfiles("test")
class ProcessHistoryRepositoryTest {

  @MockitoBean
  private MongoTemplate mongoTemplate;

  @Autowired
  private ProcessHistoryRepository repository;

  @Test
  void shouldSaveAndRetrieveProcessHistorySuccessfully() {
    ProcessHistory history = new ProcessHistory();
    history.setCorrelationId("teste-123-abc");
    history.setStatus(ProcessStatusEnum.PENDING);
    history.setFileName("documento_teste.pdf");

    ProcessHistory savedHistory = repository.save(history);
    ProcessHistory retrievedHistory = repository.findByCorrelationId(savedHistory.getCorrelationId()).orElse(null);

    assertNotNull(retrievedHistory, "The record should have been saved in the H2 database.");
    assertEquals(ProcessStatusEnum.PENDING, retrievedHistory.getStatus());
  }
}