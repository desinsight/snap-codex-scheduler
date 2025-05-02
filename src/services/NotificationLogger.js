import { DatabaseService } from './DatabaseService';
export class NotificationLogger {
    static instance;
    databaseService;
    constructor() {
        this.databaseService = new DatabaseService();
    }
    static getInstance() {
        if (!NotificationLogger.instance) {
            NotificationLogger.instance = new NotificationLogger();
        }
        return NotificationLogger.instance;
    }
    async logNotification(userId, type, content, priority, channel, template) {
        try {
            const notification = {
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
        }
        catch (error) {
            console.error('Failed to log notification:', error);
            throw error;
        }
    }
    async getNotificationHistory(userId, limit = 50, offset = 0) {
        try {
            return await this.databaseService.getNotifications(userId, limit, offset);
        }
        catch (error) {
            console.error('Failed to get notification history:', error);
            throw error;
        }
    }
    async getUnreadCount(userId) {
        try {
            const notifications = await this.databaseService.getNotifications(userId);
            return notifications.filter(n => !n.read).length;
        }
        catch (error) {
            console.error('Failed to get unread count:', error);
            throw error;
        }
    }
    async markAsRead(notificationId) {
        try {
            await this.databaseService.updateNotification(notificationId, { read: true });
        }
        catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }
    async getNotificationStats(userId, startDate, endDate) {
        try {
            const notifications = await this.databaseService.getNotificationsByDateRange(userId, startDate, endDate);
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
        }
        catch (error) {
            console.error('Failed to get notification stats:', error);
            throw error;
        }
    }
}
