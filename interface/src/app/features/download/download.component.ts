import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss'
})
export class DownloadComponent implements OnInit {
  correlationId: string | null = null;
  isDownloading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.correlationId = this.route.snapshot.paramMap.get('id');
  }

  downloadFile(): void {
    if (!this.correlationId) return;

    this.isDownloading = true;
    this.errorMessage = '';

    const downloadUrl = `${environment.apiUrl}/process/${this.correlationId}/download`;

    this.http.get(downloadUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.isDownloading = false;
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `processed_file_${this.correlationId}.txt`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        this.isDownloading = false;
        this.errorMessage = 'Failed to download the file. The link might be expired or invalid.';
        console.error('Download error:', err);
      }
    });
  }
}