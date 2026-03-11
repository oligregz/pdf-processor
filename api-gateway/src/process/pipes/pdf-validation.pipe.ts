import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class PdfValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file was uploaded in the "file" field.');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Invalid format. Only PDF files are allowed.');
    }

    
    const maxSize = 5 * 1024 * 1024; // (5MB)
    if (file.size > maxSize) {
      throw new BadRequestException(`The file exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB.`);
    }

    return file;
  }
}