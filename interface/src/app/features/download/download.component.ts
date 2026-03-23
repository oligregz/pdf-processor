import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ModalType } from '../../shared/common/types/modal.type';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [ButtonComponent, ModalComponent],
  templateUrl: './download.component.html'
})
export class DownloadComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  public correlationId = signal<string | null>(null);
  public isDownloading = signal<boolean>(false);

  public isModalOpen = signal<boolean>(false);
  public modalType = signal<ModalType>('info');
  public modalTitle = signal<string>('');
  public modalMessage = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.correlationId.set(id);
    
    if (!id) {
      this.showModal('error', 'Invalid Link', 'No file ID was found in the URL. Please check your e-mail link.');
    }
  }

  public downloadFile(): void {
    const id = this.correlationId();
    if (!id) return;

    this.isDownloading.set(true);
    const downloadUrl = `${environment.apiUrl}/process/${id}/download`;

    this.http.get(downloadUrl, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        this.isDownloading.set(false);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processed_file_${id}.txt`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        this.showModal(
          'success', 
          'Download Complete!', 
          'Your processed text file has been downloaded successfully. Check your browser downloads.'
        );
      },
      error: (err) => {
        console.error('Download error:', err);
        this.isDownloading.set(false);
        this.showModal(
          'error', 
          'Download Failed', 
          'We could not download the file. The link might be expired, invalid, or the server is unavailable.'
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