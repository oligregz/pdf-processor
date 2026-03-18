import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class UploadComponent {
  isDragging = false;
  selectedFile: File | null = null;
  isUploading = false;
  message = '';

  constructor(private uploadService: UploadService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.handleFile(event.target.files[0]);
    }
  }

  private handleFile(file: File) {
    if (file.type !== 'application/pdf') {
      this.message = 'Please select only PDF files.';
      this.selectedFile = null;
      return;
    }
    
    this.selectedFile = file;
    this.message = '';
  }

  upload() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.message = '';

    this.uploadService.uploadPdf(this.selectedFile).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.message = 'PDF sent successfully! Processing started.';
        this.selectedFile = null;
      },
      error: (err) => {
        this.isUploading = false;
        this.message = 'Error sending the file. Please try again.';
        console.error(err);
      }
    });
  }
}