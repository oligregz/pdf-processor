import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getModelToken } from '@nestjs/mongoose';
import { DataSource, EntityManager } from 'typeorm';
import { ProcessService } from './process.service';
import { ProcessHistory } from './entities/process-history.entity';
import { RateLimit } from '../auth/schemas/rate-limit.schema';
import { StorageService } from '../storage/storage.service';
import { QueueService } from 'src/queue/queue.service';
import { ProcessStatusEnum } from '../common/enums/process-status.enum';

describe('ProcessService', () => {
  let service: ProcessService;

  const mockProcessHistoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockEntityManager = {
    getRepository: jest.fn().mockReturnValue(mockProcessHistoryRepository),
  };

  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation(<T>(cb: (manager: EntityManager) => Promise<T>) => {
        return cb(mockEntityManager as unknown as EntityManager);
      }),
  };

  const mockRateLimitModel = {
    countDocuments: jest.fn(),
    create: jest.fn(),
  };

  const mockStorageService = {
    uploadPdf: jest.fn(),
  };

  const mockQueueService = {
    publishPdfUploadedEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessService,
        { provide: DataSource, useValue: mockDataSource },
        {
          provide: getRepositoryToken(ProcessHistory),
          useValue: mockProcessHistoryRepository,
        },
        {
          provide: getModelToken(RateLimit.name),
          useValue: mockRateLimitModel,
        },
        { provide: StorageService, useValue: mockStorageService },
        { provide: QueueService, useValue: mockQueueService },
      ],
    }).compile();

    service = module.get<ProcessService>(ProcessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processPdfUpload', () => {
    it('should process upload successfully when within rate limit', async () => {
      const mockUserId = 'user-123';
      const mockEmail = 'user@example.com';
      const mockFile = {
        originalname: 'document.pdf',
        buffer: Buffer.from('fake-pdf-content'),
      } as Express.Multer.File;

      const mockStoragePath = 'cloud/path/to/document.pdf';
      const mockHistoryRecord = {
        id: 'history-123',
        status: ProcessStatusEnum.PENDING,
      } as ProcessHistory;

      mockRateLimitModel.countDocuments.mockResolvedValue(1);
      mockStorageService.uploadPdf.mockResolvedValue(mockStoragePath);

      mockProcessHistoryRepository.create.mockReturnValue(mockHistoryRecord);
      mockProcessHistoryRepository.save.mockResolvedValue(mockHistoryRecord);

      const result = await service.processPdfUpload(
        mockUserId,
        mockEmail,
        mockFile,
      );

      expect(mockRateLimitModel.countDocuments).toHaveBeenCalledWith(
        expect.objectContaining({ userId: mockUserId }),
      );
      expect(mockStorageService.uploadPdf).toHaveBeenCalled();
      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(mockRateLimitModel.create).toHaveBeenCalled();

      expect(mockQueueService.publishPdfUploadedEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          email: mockEmail,
          storagePath: mockStoragePath,
        }),
      );

      expect(result.message).toBe('File successfully accepted for processing.');
      expect(typeof result.correlationId).toBe('string');
      expect(result.status).toBe(ProcessStatusEnum.PENDING);
    });
  });
});
