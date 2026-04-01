import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerOptions, Server } from 'socket.io';

export class SocketIoConfigAdapter extends IoAdapter {
  constructor(
    private app: INestApplication,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const corsOrigins = this.configService.get<string[]>('CORS_ORIGINS') ?? [];

    const optionsWithCors = {
      ...options,
      cors: {
        origin: corsOrigins,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
      },
    } as ServerOptions;

    return super.createIOServer(port, optionsWithCors) as Server;
  }
}
