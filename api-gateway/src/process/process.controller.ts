import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProcessService } from './process.service';
import { PdfValidationPipe } from './pipes/pdf-validation.pipe';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileUploadDto } from 'src/common/dtos/file-upload.dto';

@ApiTags('Processamento de PDF')
@ApiBearerAuth()
@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) { }

  @Post('upload')
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
    @Req() req: any,
  ) {

    const { userId, email } = req.user;
    return await this.processService.processPdfUpload(userId, email, file);
  }
}