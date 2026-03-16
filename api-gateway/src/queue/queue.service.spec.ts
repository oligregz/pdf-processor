import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  let service: QueueService;

  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
