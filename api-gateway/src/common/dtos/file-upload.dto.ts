import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'PDF file for text extraction (Maximum 5MB)',
  })
  file: any;
}
