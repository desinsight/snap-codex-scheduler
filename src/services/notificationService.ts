import {
  NotificationType,
  NotificationPreference,
  NotificationHistory,
  NotificationTemplate,
} from '../types/notification';
import { Schedule } from '../types/schedule';
import { EmailService } from './EmailService';
import { WebSocketService } from './WebSocketService';
import { DatabaseService } from './DatabaseService';
import { EventEmitter } from 'events';

export interface NotificationOptions {
  userId: string;
  type: string;
  data: any;
  priority?: 'low' | 'medium' | 'high';
  channels?: ('email' | 'websocket' | 'push')[];
}

export class NotificationService {
  private static instance: NotificationService;
  private eventEmitter: EventEmitter;
  private emailService: EmailService;
  private webSocketService: WebSocketService;
  private databaseService: DatabaseService;
  private templates: Map<string, NotificationTemplate>;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.emailService = EmailService.getInstance();
    this.webSocketService = WebSocketService.getInstance();
    this.databaseService = new DatabaseService();
    this.templates = new Map();
    this.initializeEventListeners();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeEventListeners(): void {
    this.eventEmitter.on('notification', async (options: NotificationOptions) => {
      await this.processNotification(options);
    });
  }

  public async sendNotification(options: NotificationOptions): Promise<void> {
    this.eventEmitter.emit('notification', options);
  }

  private async processNotification(options: NotificationOptions): Promise<void> {
    const { userId, type, data, priority = 'medium', channels = ['email', 'websocket'] } = options;
    
    try {
      const template = this.getTemplate(type);
      if (!template) {
        throw new Error(`Template not found for type: ${type}`);
      }

      const notification = this.formatNotification(template, data);

      // 채널별 알림 전송
      for (const channel of channels) {
        switch (channel) {
          case 'email':
            await this.emailService.sendEmail(userId, notification);
            break;
          case 'websocket':
            await this.webSocketService.sendNotification(userId, notification);
            break;
          // push 알림은 추후 구현
        }
      }

      // 알림 로깅
      await this.logNotification(userId, type, notification, priority);
    } catch (error) {
      console.error('Failed to process notification:', error);
      throw error;
    }
  }

  private getTemplate(type: string): NotificationTemplate | undefined {
    return this.templates.get(type);
  }

  private formatNotification(template: NotificationTemplate, data: any): string {
    let message = template.message;
    Object.keys(data).forEach(key => {
      message = message.replace(`{${key}}`, data[key]);
    });
    return message;
  }

  private async logNotification(
    userId: string,
    type: string,
    content: string,
    priority: string
  ): Promise<void> {
    // TODO: 알림 로깅 구현
    console.log(`Notification logged: ${userId}, ${type}, ${priority}`);
  }

  public registerTemplate(type: string, template: NotificationTemplate): void {
    this.templates.set(type, template);
  }

  public getTemplates(): Map<string, NotificationTemplate> {
    return this.templates;
  }

  public async scheduleNotification(
    eventId: string,
    eventTitle: string,
    timing: Date,
    preferences: NotificationPreference
  ) {
    const timeUntilNotification = timing.getTime() - Date.now();
    if (timeUntilNotification <= 0) return;

    setTimeout(async () => {
      const notification: NotificationHistory = {
        id: crypto.randomUUID(),
        eventId,
        eventTitle,
        type: preferences.type,
        message: `일정 알림: ${eventTitle}`,
        timestamp: new Date(),
        read: false,
      };

      // 웹소켓을 통해 알림 전송
      this.webSocketService.sendNotification(notification);

      // 이메일 알림 전송
      if (preferences.type === 'EMAIL' || preferences.type === 'BOTH') {
        await this.emailService.sendEmail(
          'user@example.com', // 실제 사용자 이메일
          {
            id: 'event-reminder',
            type: 'email',
            name: '일정 알림',
            category: 'work',
            subject: `일정 알림: ${eventTitle}`,
            content: `
              <h1>일정 알림</h1>
              <p>귀하의 일정 "${eventTitle}"이 곧 시작됩니다.</p>
              <p>시작 시간: ${timing.toLocaleString()}</p>
            `,
            variables: ['eventTitle', 'startTime'],
            isDefault: true,
            versions: [],
            usage: { total: 0, success: 0, failed: 0 },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            eventTitle,
            startTime: timing.toLocaleString(),
          }
        );
      }
    }, timeUntilNotification);
  }

  public async getNotificationHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationHistory[]> {
    return this.databaseService.getNotifications(limit, offset);
  }

  public async markNotificationAsRead(notificationId: string) {
    await this.databaseService.updateNotification(notificationId, { read: true });
  }

  public async getUnreadCount(): Promise<number> {
    const notifications = await this.databaseService.getNotifications(Infinity);
    return notifications.filter(n => !n.read).length;
  }

  public async savePreferences(userId: string, preferences: NotificationPreference) {
    await this.databaseService.savePreferences(userId, preferences);
  }

  public async getPreferences(userId: string): Promise<NotificationPreference | null> {
    return this.databaseService.getPreferences(userId);
  }

  public async backup() {
    await this.databaseService.backup();
  }

  public async restore(backupFile: File) {
    await this.databaseService.restore(backupFile);
  }
}
