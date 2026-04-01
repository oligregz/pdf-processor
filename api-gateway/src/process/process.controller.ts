import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProcessService } from './process.service';
import { PdfValidationPipe } from './pipes/pdf-validation.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/common/dtos/file-upload.dto';
import type { IAuthenticatedRequest } from 'src/common/interfaces/process.interface';
import { ApiDownloadDocs } from 'src/common/decorators/download-docs.decorator';
import { StorageService } from 'src/storage/storage.service';
import { EventsGateway } from '../events/events.gateway';

@ApiTags('PDF Processing')
@Controller('process')
export class ProcessController {
  private readonly logger = new Logger(ProcessController.name);

  constructor(
    private readonly processService: ProcessService,
    private readonly storageService: StorageService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a PDF for background text extraction.' })
  @ApiBody({
    description: 'PDF file upload',
    type: FileUploadDto,
  })
  async uploadPdf(
    @UploadedFile(PdfValidationPipe) file: Express.Multer.File,
    @Req() req: IAuthenticatedRequest,
  ) {
    const { userId, email } = req.user;

    if (this.eventsGateway.canProcessImmediately()) {
      this.eventsGateway.incrementProcessingCount();
      this.eventsGateway.notifyJobProcessing(userId);
    } else {
      this.eventsGateway.incrementProcessingCount();
      const position = this.eventsGateway.getCurrentQueueDepth();
      this.eventsGateway.notifyJobQueued(userId, position);
    }

    return await this.processService.processPdfUpload(userId, email, file);
  }

  @Get(':correlationId/download')
  @ApiOperation({
    summary: 'Download the processed TXT file via Correlation ID',
  })
  @ApiDownloadDocs()
  async downloadProcessedFile(
    @Param('correlationId') correlationId: string,
    @Res() res: Response,
  ) {
    try {
      const fileKey = `pdfs/${correlationId}.txt`;
      const fileStream = await this.storageService.getFileStream(fileKey);

      res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="processed_${correlationId}.txt"`,
      });

      fileStream.pipe(res);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to download file: ${correlationId}`,
        errorMessage,
      );

      res.status(HttpStatus.NOT_FOUND).json({
        message: 'File not ready or does not exist.',
      });
    }
  }
}
