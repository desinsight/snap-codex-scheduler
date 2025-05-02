import { NotificationHistory, NotificationTemplate } from '../types/notification';
import { DatabaseService } from './DatabaseService';

export class NotificationLogger {
  private static instance: NotificationLogger;
  private databaseService: DatabaseService;

  private constructor() {
    this.databaseService = new DatabaseService();
  }

  public static getInstance(): NotificationLogger {
    if (!NotificationLogger.instance) {
      NotificationLogger.instance = new NotificationLogger();
    }
    return NotificationLogger.instance;
  }

  public async logNotification(
    userId: string,
    type: string,
    content: string,
    priority: string,
    channel: 'email' | 'websocket' | 'push',
    template?: NotificationTemplate
  ): Promise<void> {
    try {
      const notification: NotificationHistory = {
        id: crypto.randomUUID(),
        userId,
        type,
        content,
        timestamp: new Date(),
        status: 'sent',
        channel
      };

      await this.databaseService.saveNotification(notification);
      console.log(`Notification logged: ${userId}, ${type}, ${channel}`);
    } catch (error) {
      console.error('Failed to log notification:', error);
      throw error;
    }
  }

  public async getNotificationHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationHistory[]> {
    try {
      return await this.databaseService.getNotifications(userId, limit, offset);
    } catch (error) {
      console.error('Failed to get notification history:', error);
      throw error;
    }
  }

  public async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.databaseService.getNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      throw error;
    }
  }

  public async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.databaseService.updateNotification(notificationId, { read: true });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  public async getNotificationStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    total: number;
    byType: Record<string, number>;
    byChannel: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      const notifications = await this.databaseService.getNotificationsByDateRange(
        userId,
        startDate,
        endDate
      );

      const stats = {
        total: notifications.length,
        byType: {},
        byChannel: {},
        byPriority: {}
      };

      notifications.forEach(notification => {
        stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
        stats.byChannel[notification.channel] = (stats.byChannel[notification.channel] || 0) + 1;
        stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get notification stats:', error);
      throw error;
    }
  }
} 