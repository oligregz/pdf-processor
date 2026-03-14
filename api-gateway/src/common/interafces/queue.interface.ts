export interface IPdfUploadedEventPayload {
	correlationId: string;
	userId: string;
	email: string;
	originalFileName: string;
	storagePath: string;
}
