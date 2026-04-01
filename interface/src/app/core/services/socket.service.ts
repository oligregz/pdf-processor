import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment'; 
import { JobStatusType } from '../../shared/common/types/socket.type';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;

  public activeUsers = signal<number>(1);
  public jobStatus = signal<JobStatusType>('idle');
  public queuePosition = signal<number>(0);
  public completedFileId = signal<string | null>(null);

  public connect(): void {
    const token = localStorage.getItem('pdf_token');
    if (!token || this.socket?.connected) return;

    this.socket = io(environment.apiUrl, {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('active_users', (count: number) => {
      this.activeUsers.set(count);
    });

    this.socket.on('job_queued', (data: { position: number }) => {
      this.jobStatus.set('queued');
      this.queuePosition.set(data.position);
    });

    this.socket.on('job_processing', () => {
      this.jobStatus.set('processing');
    });

    this.socket.on('job_completed', (data: { correlationId: string }) => {
      this.jobStatus.set('completed');
      this.completedFileId.set(data.correlationId);
    });

    this.socket.on('job_failed', () => {
      this.jobStatus.set('failed');
    });
  }

  public resetJobState(): void {
    this.jobStatus.set('idle');
    this.queuePosition.set(0);
    this.completedFileId.set(null);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}