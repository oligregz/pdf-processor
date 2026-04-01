export interface IPdfUploadedEventPayload {
  correlationId: string;
  userId: string;
  email: string;
  originalFileName: string;
  storagePath: string;
}

export interface IPdfProcessedPayload {
  correlationId: string;
  userId: string;
}
