export const RabbitMQ = {
  Exchanges: {
    PDF: 'pdf.exchange',
  },

  Queues: {
    PROCESS: 'pdf.process.queue',
    WAIT: 'pdf.wait.queue',
    DLQ: 'pdf.dlq.queue',
  },

  Routing: {
    PROCESS: 'pdf.process',
    WAIT: 'pdf.wait',
    DLQ: 'pdf.dlq',
  },

  QueueArguments: {
    PROCESS_DLQ: {
      'x-dead-letter-exchange': 'pdf.exchange',
      'x-dead-letter-routing-key': 'pdf.wait',
    },
  },
} as const;
