import {
  NotificationType,
  NotificationPreference,
  NotificationHistory,
} from '../types/notification';
import EmailService from './EmailService';
import WebSocketService from './WebSocketService';
import DatabaseService from './DatabaseService';

class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private emailService: EmailService;
  private webSocketService: WebSocketService;
  private databaseService: DatabaseService;

  private constructor() {
    this.initializeServices();
    this.initializeBrowserNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeServices() {
    // 이메일 서비스 초기화
    this.emailService = EmailService.getInstance({
      provider: 'sendgrid', // 또는 'ses'
      apiKey: process.env.EMAIL_API_KEY || '',
      fromEmail: 'notifications@example.com',
      fromName: 'SnapCodex 알림',
    });

    // 웹소켓 서비스 초기화
    this.webSocketService = WebSocketService.getInstance({
      url: process.env.WS_URL || 'ws://localhost:8080',
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
    });

    // 데이터베이스 서비스 초기화
    this.databaseService = DatabaseService.getInstance({
      type: 'indexeddb',
      config: {},
    });

    // 웹소켓 이벤트 구독
    this.webSocketService.subscribe('notification', (notification: NotificationHistory) => {
      this.handleIncomingNotification(notification);
    });
  }

  private async initializeBrowserNotifications() {
    if (!('Notification' in window)) {
      console.warn('이 브라우저는 알림을 지원하지 않습니다.');
      return;
    }

    this.permission = await Notification.requestPermission();
  }

  private async handleIncomingNotification(notification: NotificationHistory) {
    // 데이터베이스에 저장
    await this.databaseService.saveNotification(notification);

    // 브라우저 알림 표시
    if (this.permission === 'granted') {
      await this.sendBrowserNotification(notification.eventTitle, {
        body: notification.message,
        icon: '/notification-icon.png',
        tag: notification.id,
      });
    }
  }

  public async sendBrowserNotification(title: string, options: NotificationOptions) {
    if (this.permission !== 'granted') {
      console.warn('브라우저 알림 권한이 없습니다.');
      return;
    }

    return new Notification(title, options);
  }

  public async sendEmailNotification(
    to: string,
    template: NotificationTemplate,
    variables: Record<string, string>
  ) {
    return this.emailService.sendEmail(to, template, variables);
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
        await this.sendEmailNotification(
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

export default NotificationService;
