import { EmailService } from './EmailService';
import { WebSocketService } from './WebSocketService';
import { DatabaseService } from './DatabaseService';
import { EventEmitter } from 'events';
export class NotificationService {
    static instance;
    eventEmitter;
    emailService;
    webSocketService;
    databaseService;
    templates;
    constructor() {
        this.eventEmitter = new EventEmitter();
        this.emailService = EmailService.getInstance();
        this.webSocketService = WebSocketService.getInstance();
        this.databaseService = new DatabaseService();
        this.templates = new Map();
        this.initializeEventListeners();
    }
    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }
    initializeEventListeners() {
        this.eventEmitter.on('notification', async (options) => {
            await this.processNotification(options);
        });
    }
    async sendNotification(options) {
        this.eventEmitter.emit('notification', options);
    }
    async processNotification(options) {
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
        }
        catch (error) {
            console.error('Failed to process notification:', error);
            throw error;
        }
    }
    getTemplate(type) {
        return this.templates.get(type);
    }
    formatNotification(template, data) {
        let message = template.message;
        Object.keys(data).forEach(key => {
            message = message.replace(`{${key}}`, data[key]);
        });
        return message;
    }
    async logNotification(userId, type, content, priority) {
        // TODO: 알림 로깅 구현
        console.log(`Notification logged: ${userId}, ${type}, ${priority}`);
    }
    registerTemplate(type, template) {
        this.templates.set(type, template);
    }
    getTemplates() {
        return this.templates;
    }
    async scheduleNotification(eventId, eventTitle, timing, preferences) {
        const timeUntilNotification = timing.getTime() - Date.now();
        if (timeUntilNotification <= 0)
            return;
        setTimeout(async () => {
            const notification = {
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
                await this.emailService.sendEmail('user@example.com', // 실제 사용자 이메일
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
                }, {
                    eventTitle,
                    startTime: timing.toLocaleString(),
                });
            }
        }, timeUntilNotification);
    }
    async getNotificationHistory(limit = 50, offset = 0) {
        return this.databaseService.getNotifications(limit, offset);
    }
    async markNotificationAsRead(notificationId) {
        await this.databaseService.updateNotification(notificationId, { read: true });
    }
    async getUnreadCount() {
        const notifications = await this.databaseService.getNotifications(Infinity);
        return notifications.filter(n => !n.read).length;
    }
    async savePreferences(userId, preferences) {
        await this.databaseService.savePreferences(userId, preferences);
    }
    async getPreferences(userId) {
        return this.databaseService.getPreferences(userId);
    }
    async backup() {
        await this.databaseService.backup();
    }
    async restore(backupFile) {
        await this.databaseService.restore(backupFile);
    }
}
