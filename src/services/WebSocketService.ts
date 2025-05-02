import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { NotificationTemplate } from '../types/notification';

export class WebSocketService {
  private static instance: WebSocketService;
  private io: Server;
  private userSockets: Map<string, string[]>;

  private constructor() {
    this.userSockets = new Map();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initialize(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('authenticate', (userId: string) => {
        this.associateUserWithSocket(userId, socket.id);
      });

      socket.on('disconnect', () => {
        this.removeSocket(socket.id);
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private associateUserWithSocket(userId: string, socketId: string): void {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    this.userSockets.get(userId)?.push(socketId);
  }

  private removeSocket(socketId: string): void {
    for (const [userId, sockets] of this.userSockets.entries()) {
      const index = sockets.indexOf(socketId);
      if (index !== -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
  }

  public async sendNotification(
    userId: string,
    content: string,
    template?: NotificationTemplate
  ): Promise<void> {
    try {
      const sockets = this.userSockets.get(userId);
      if (!sockets || sockets.length === 0) {
        console.log(`No active sockets for user: ${userId}`);
        return;
      }

      const notification = {
        content,
        template,
        timestamp: new Date().toISOString()
      };

      sockets.forEach(socketId => {
        this.io.to(socketId).emit('notification', notification);
      });

      console.log(`Notification sent to user ${userId} via ${sockets.length} sockets`);
    } catch (error) {
      console.error('Failed to send WebSocket notification:', error);
      throw error;
    }
  }

  public getActiveUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  public getActiveSockets(userId: string): string[] {
    return this.userSockets.get(userId) || [];
  }
}
