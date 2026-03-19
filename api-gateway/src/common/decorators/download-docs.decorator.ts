import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiDownloadDocs() {
  return applyDecorators(
    ApiParam({
      name: 'correlationId',
      description: 'The unique processing ID',
      example: 'abc-123',
    }),
    ApiResponse({
      status: 200,
      description: 'File stream returned successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'File not found or processing incomplete.',
    }),
  );
}
