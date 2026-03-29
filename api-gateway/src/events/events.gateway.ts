import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { IPayloadJWT } from '../common/interafces/payload.interface';

@WebSocketGateway({
  transports: ['websocket'],
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server!: Server;

  private readonly logger = new Logger(EventsGateway.name);

  private connectedUsers = new Map<string, string>();
  private activeProcessingCount = 0;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth['token'] as string | undefined;

      if (!token) {
        throw new Error('Token not provided');
      }

      const secret = this.configService.getOrThrow<string>('JWT_SECRET');

      const payload = this.jwtService.verify<IPayloadJWT>(token, { secret });

      const userId = String(payload.sub);

      await client.join(userId);

      this.connectedUsers.set(client.id, userId);
      this.broadcastActiveUsers();

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.error(
        `Connection refused: ${client.id} - Reason: ${(error as Error).message}`,
      );
      client.disconnect(true);
    }
  }

  public handleDisconnect(client: Socket): void {
    this.connectedUsers.delete(client.id);
    this.broadcastActiveUsers();
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private broadcastActiveUsers(): void {
    const uniqueUsers = new Set(this.connectedUsers.values()).size;
    this.server.emit('active_users', uniqueUsers);
  }

  public notifyJobQueued(userId: string, position: number): void {
    this.server.to(userId).emit('job_queued', { position });
  }

  public notifyJobProcessing(userId: string): void {
    this.server.to(userId).emit('job_processing');
  }

  public notifyJobCompleted(userId: string, correlationId: string): void {
    this.activeProcessingCount = Math.max(0, this.activeProcessingCount - 1);
    this.server.to(userId).emit('job_completed', { correlationId });
  }

  public notifyJobFailed(userId: string): void {
    this.activeProcessingCount = Math.max(0, this.activeProcessingCount - 1);
    this.server.to(userId).emit('job_failed');
  }

  public canProcessImmediately(): boolean {
    return this.activeProcessingCount < 5;
  }

  public incrementProcessingCount(): void {
    this.activeProcessingCount++;
  }

  public getCurrentQueueDepth(): number {
    return Math.max(0, this.activeProcessingCount - 5);
  }
}
