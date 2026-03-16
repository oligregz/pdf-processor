import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.getOrThrow<string>(
      'CLOUDFLARE_ACCOUNT_ID',
    );
    this.bucketName = this.configService.getOrThrow<string>(
      'CLOUDFLARE_R2_BUCKET_NAME',
    );

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>(
          'CLOUDFLARE_R2_ACCESS_KEY',
        ),
        secretAccessKey: this.configService.getOrThrow<string>(
          'CLOUDFLARE_R2_SECRET_KEY',
        ),
      },
    });
  }

  async uploadPdf(fileBuffer: Buffer, fileName: string): Promise<string> {
    const objectKey = `pdfs/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: 'application/pdf',
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`File [${objectKey}] successfully uploaded to R2.`);
      return objectKey;
    } catch (error) {
      this.logger.error(
        `Failed to upload file to R2: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error uploading file to storage provider.',
      );
    }
  }
}
