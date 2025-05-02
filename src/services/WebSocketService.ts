import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { NotificationHistory } from '../types/notification';

interface WebSocketConfig {
  port: number;
  cors: {
    origin: string;
    methods: string[];
  };
}

export class WebSocketService {
  private static instance: WebSocketService;
  private io: Server;
  private connectedClients: Map<string, Set<string>>; // userId -> socketIds

  private constructor() {
    this.initializeServer();
    this.connectedClients = new Map();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private initializeServer() {
    const app = express();
    const httpServer = createServer(app);
    
    const config: WebSocketConfig = {
      port: parseInt(process.env.WS_PORT || '3001'),
      cors: {
        origin: process.env.WS_CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
      },
    };

    this.io = new Server(httpServer, {
      cors: config.cors,
    });

    this.io.on('connection', (socket) => {
      const userId = socket.handshake.auth.userId;
      if (!userId) {
        socket.disconnect();
        return;
      }

      // Add socket to user's connected clients
      if (!this.connectedClients.has(userId)) {
        this.connectedClients.set(userId, new Set());
      }
      this.connectedClients.get(userId)?.add(socket.id);

      // Handle disconnection
      socket.on('disconnect', () => {
        this.connectedClients.get(userId)?.delete(socket.id);
        if (this.connectedClients.get(userId)?.size === 0) {
          this.connectedClients.delete(userId);
        }
      });

      // Handle custom events
      socket.on('subscribe', (channel: string) => {
        socket.join(channel);
      });

      socket.on('unsubscribe', (channel: string) => {
        socket.leave(channel);
      });
    });

    httpServer.listen(config.port, () => {
      console.log(`WebSocket server running on port ${config.port}`);
    });
  }

  public sendNotification(userId: string, notification: NotificationHistory) {
    const clients = this.connectedClients.get(userId);
    if (clients) {
      clients.forEach((socketId) => {
        this.io.to(socketId).emit('notification', notification);
      });
    }
  }

  public broadcastToChannel(channel: string, event: string, data: any) {
    this.io.to(channel).emit(event, data);
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.connectedClients.keys());
  }

  public getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}
