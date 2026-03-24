import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { UploadService } from './upload.service';
import { SocketService } from '../../core/services/socket.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ModalType } from '../../shared/common/types/modal.type';

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
  
  public isModalOpen = signal<boolean>(false);
  public modalType = signal<ModalType>('info');
  public modalTitle = signal<string>('');
  public modalMessage = signal<string>('');

  public formattedFileSize = computed<string>(() => {
    const file = this.selectedFile();
    if (!file) return '';
    return (file.size / (1024 * 1024)).toFixed(2) + ' MB';
  });

  private statusEffect = computed(() => {
    const status = this.socketService.jobStatus();
    if (status === 'completed') {
      this.showModal('success', 'Processing Complete!', 'Your PDF has been successfully converted. We have sent a confirmation to your e-mail.');
      this.selectedFile.set(null);
    } else if (status === 'failed') {
      this.showModal('error', 'Processing Error', 'There was an error processing your file in the background. Please try again.');
      this.socketService.resetJobState();
    }
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
    this.socketService.resetJobState();
  }

  public upload(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.socketService.jobStatus.set('processing');

    this.uploadService.uploadPdf(file).subscribe({
      next: () => {
        console.log('Upload HTTP complete. Waiting for socket events...');
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.socketService.resetJobState();
        this.showModal('error', 'Server Error', 'Could not upload the file. The server might be unreachable.');
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
    this.socketService.resetJobState();
  }
}