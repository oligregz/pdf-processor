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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express'; // Correção 2: importação como 'type'
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
import type { IAuthenticatedRequest } from 'src/common/interafces/process.interface';
import { ApiDownloadDocs } from 'src/common/decorators/download-docs.decorator';

@ApiTags('PDF Processing')
@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

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
    return await this.processService.processPdfUpload(userId, email, file);
  }

  @Get(':correlationId/download')
  @ApiOperation({
    summary: 'Download the processed TXT file via Correlation ID',
  })
  @ApiDownloadDocs()
  downloadProcessedFile(
    @Param('correlationId') correlationId: string,
    @Res() res: Response,
  ) {
    try {
      res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="processed_${correlationId}.txt"`,
      });
      res.send(
        `This is a mock text file for correlation ID: ${correlationId}.\nYour R2 integration will replace this.`,
      );
    } catch {
      res.status(HttpStatus.NOT_FOUND).json({
        message: 'File not ready or does not exist.',
      });
    }
  }
}
