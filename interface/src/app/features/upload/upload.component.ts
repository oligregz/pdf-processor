import { Component, computed, inject, signal } from '@angular/core';
import { UploadService } from './upload.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ModalType } from '../../shared/common/types/modal.type';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ButtonComponent, ModalComponent],
  templateUrl: './upload.component.html'
})
export class UploadComponent {
  private uploadService = inject(UploadService);

  public isDragging = signal<boolean>(false);
  public selectedFile = signal<File | null>(null);
  public isUploading = signal<boolean>(false);

  public isModalOpen = signal<boolean>(false);
  public modalType = signal<ModalType>('info');
  public modalTitle = signal<string>('');
  public modalMessage = signal<string>('');

  public formattedFileSize = computed<string>(() => {
    const file = this.selectedFile();
    if (!file) return '';
    return (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  });

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file.type !== 'application/pdf') {
      this.showModal('error', 'Invalid Format', 'Please select only PDF files.');
      this.selectedFile.set(null);
      return;
    }
    
    this.selectedFile.set(file);
  }

  public upload(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);

    this.uploadService.uploadPdf(file).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.selectedFile.set(null);
        this.showModal(
          'success', 
          'Upload Successful', 
          'Your PDF has been sent to our background workers. We will email you the download link once processing is complete.'
        );
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.isUploading.set(false);
        this.showModal(
          'error', 
          'Processing Error', 
          'An error occurred while communicating with the server. Please try again later.'
        );
      }
    });
  }

  private showModal(type: ModalType, title: string, message: string): void {
    this.modalType.set(type);
    this.modalTitle.set(title);
    this.modalMessage.set(message);
    this.isModalOpen.set(true);
  }
}