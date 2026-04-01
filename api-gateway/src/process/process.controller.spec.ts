import { Test, TestingModule } from '@nestjs/testing';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { StorageService } from '../storage/storage.service';
import { EventsGateway } from '../events/events.gateway';

describe('ProcessController', () => {
  let controller: ProcessController;
  let processService: ProcessService;
  let storageService: StorageService;
  let eventsGateway: EventsGateway;

  const mockProcessService = {
    processPdfUpload: jest.fn(),
  };

  const mockStorageService = {
    getFileStream: jest.fn(),
  };

  const mockEventsGateway = {
    canProcessImmediately: jest.fn(),
    incrementProcessingCount: jest.fn(),
    notifyJobProcessing: jest.fn(),
    getCurrentQueueDepth: jest.fn(),
    notifyJobQueued: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessController],
      providers: [
        {
          provide: ProcessService,
          useValue: mockProcessService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: EventsGateway,
          useValue: mockEventsGateway,
        },
      ],
    }).compile();

    controller = module.get<ProcessController>(ProcessController);
    processService = module.get<ProcessService>(ProcessService);
    storageService = module.get<StorageService>(StorageService);
    eventsGateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(processService).toBeDefined();
    expect(storageService).toBeDefined();
    expect(eventsGateway).toBeDefined();
  });
});
