import { Test, TestingModule } from '@nestjs/testing';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { StorageService } from '../storage/storage.service';

describe('ProcessController', () => {
  let controller: ProcessController;
  let processService: ProcessService;
  let storageService: StorageService;

  const mockProcessService = {
    processPdfUpload: jest.fn(),
  };

  const mockStorageService = {
    getFileStream: jest.fn(),
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
      ],
    }).compile();

    controller = module.get<ProcessController>(ProcessController);
    processService = module.get<ProcessService>(ProcessService);
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(processService).toBeDefined();
    expect(storageService).toBeDefined();
  });
});
