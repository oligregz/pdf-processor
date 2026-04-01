import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { UploadService } from './upload.service';
import { SocketService } from '../../core/services/socket.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ModalType } from '../../shared/common/types/modal.type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ButtonComponent, ModalComponent],
  templateUrl: './upload.component.html'
})
export class UploadComponent implements OnInit, OnDestroy {
  private uploadService = inject(UploadService);
  public socketService = inject(SocketService);

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

  ngOnInit(): void {
    this.socketService.connect();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

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
          'Your file has been sent for processing. You will receive an e-mail shortly once it is ready.'
        );
      },
      error: (err: HttpErrorResponse) => {
        console.error('Upload error:', err);
        this.isUploading.set(false);

        if (err.status === 429 && err.error?.message) {
          this.showModal(
            'error',
            'Limit Exceeded',
            err.error.message
          );
        } else {
          this.showModal(
            'error',
            'Upload Failed',
            'Please try again later.'
          );
        }
      }
    });
  }

  private showModal(type: ModalType, title: string, message: string): void {
    this.modalType.set(type);
    this.modalTitle.set(title);
    this.modalMessage.set(message);
    this.isModalOpen.set(true);
  }

  public closeModal(): void {
    this.isModalOpen.set(false);
  }
}