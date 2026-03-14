import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProcessService } from './process.service';
import { PdfValidationPipe } from './pipes/pdf-validation.pipe';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) { }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @UploadedFile(PdfValidationPipe) file: Express.Multer.File,
    @Req() req: any,
  ) {
    const { userId, email } = req.user;

    return await this.processService.processPdfUpload(userId, email, file);
  }
}