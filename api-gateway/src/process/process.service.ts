import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { ProcessHistory } from './entities/process-history.entity';
import { RateLimit } from '../auth/schemas/rate-limit.schema';
import { ProcessStatusEnum } from '../common/enums/process-status.enum';
import { RateLimitActionEnum } from '../common/enums/rate-limit-action.enum';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ProcessService {
  private readonly logger = new Logger(ProcessService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ProcessHistory)
    private readonly processHistoryRepository: Repository<ProcessHistory>,
    @InjectModel(RateLimit.name)
    private readonly rateLimitModel: Model<RateLimit>,
    private readonly storageService: StorageService,
  ) {}

  async processPdfUpload(userId: string, file: Express.Multer.File) {
    await this.validateRateLimit(userId);
    const correlationId = this.generateCorrelationId();

    const storagePath = await this.uploadToCloud(file, correlationId);

    const processHistory = await this.dataSource.transaction(async (manager: EntityManager) => {
      const history = await this.createProcessHistory(
        manager,
        userId,
        correlationId,
        storagePath,
      );

      await this.createRateLimitRecord(userId);
      return history;
    });

    this.logAcceptedUpload(userId, storagePath, correlationId);

    return this.buildResponse(processHistory, correlationId);
  }

  private async validateRateLimit(userId: string): Promise<void> {
    const currentUploadsCount = await this.rateLimitModel.countDocuments({
      userId,
      action: RateLimitActionEnum.PDF_UPLOAD,
    });

    if (currentUploadsCount >= 3) {
      this.logger.warn(`User ${userId} exceeded the daily upload limit.`);
      throw new HttpException(
        'Rate limit exceeded. A maximum of 3 PDF uploads per 24 hours is allowed.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private generateCorrelationId(): string {
    return uuidv4();
  }

  private async uploadToCloud(file: Express.Multer.File, correlationId: string): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${correlationId}.${fileExtension}`;
    
    try {
      return await this.storageService.uploadPdf(file.buffer, uniqueFileName);
    } catch (error) {
      throw new HttpException(
        'Storage service is currently unavailable. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createProcessHistory(
    manager: EntityManager,
    userId: string,
    correlationId: string,
    storagePath: string,
  ): Promise<ProcessHistory> {
    const repository = manager.getRepository(ProcessHistory);

    const processHistory = repository.create({
      user: { id: userId },
      correlationId,
      fileName: storagePath,
      status: ProcessStatusEnum.PENDING,
    });

    return repository.save(processHistory);
  }

  private async createRateLimitRecord(userId: string): Promise<void> {
    const expireAt = this.calculateExpiration();

    await this.rateLimitModel.create({
      userId,
      action: RateLimitActionEnum.PDF_UPLOAD,
      expireAt,
    });
  }

  private calculateExpiration(): Date {
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 24);
    return expireAt;
  }

  private logAcceptedUpload(userId: string, fileName: string, correlationId: string) {
    this.logger.log(`File [${fileName}] accepted for user ${userId}. CorrelationID: ${correlationId}`);
  }

  private buildResponse(processHistory: ProcessHistory, correlationId: string) {
    return {
      message: 'File successfully accepted for processing.',
      correlationId,
      status: processHistory.status,
    };
  }
}