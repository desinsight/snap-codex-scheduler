import webpush from 'web-push';
export class PushNotificationService {
    static instance;
    subscriptions;
    constructor() {
        this.subscriptions = new Map();
        this.initializeVAPID();
    }
    initializeVAPID() {
        const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
        const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
        if (!vapidPublicKey || !vapidPrivateKey) {
            throw new Error('VAPID keys are not configured');
        }
        webpush.setVapidDetails('mailto:your-email@example.com', vapidPublicKey, vapidPrivateKey);
    }
    static getInstance() {
        if (!PushNotificationService.instance) {
            PushNotificationService.instance = new PushNotificationService();
        }
        return PushNotificationService.instance;
    }
    async subscribeUser(userId, subscription) {
        if (!this.subscriptions.has(userId)) {
            this.subscriptions.set(userId, []);
        }
        this.subscriptions.get(userId)?.push(subscription);
    }
    async unsubscribeUser(userId, endpoint) {
        const userSubscriptions = this.subscriptions.get(userId);
        if (userSubscriptions) {
            this.subscriptions.set(userId, userSubscriptions.filter(sub => sub.endpoint !== endpoint));
        }
    }
    async sendNotification(userId, content, template) {
        try {
            const subscriptions = this.subscriptions.get(userId);
            if (!subscriptions || subscriptions.length === 0) {
                console.log(`No active push subscriptions for user: ${userId}`);
                return;
            }
            const notification = {
                title: template?.subject || 'Notification',
                body: content,
                icon: '/notification-icon.png',
                badge: '/badge-icon.png',
                data: {
                    url: '/notifications',
                    timestamp: new Date().toISOString()
                }
            };
            const promises = subscriptions.map(subscription => webpush.sendNotification(subscription, JSON.stringify(notification))
                .catch(error => {
                if (error.statusCode === 410) {
                    // 구독이 만료된 경우 제거
                    this.unsubscribeUser(userId, subscription.endpoint);
                }
                console.error('Failed to send push notification:', error);
            }));
            await Promise.all(promises);
            console.log(`Push notification sent to user ${userId}`);
        }
        catch (error) {
            console.error('Error sending push notification:', error);
            throw error;
        }
    }
    getVAPIDPublicKey() {
        return process.env.VAPID_PUBLIC_KEY || '';
    }
    getUserSubscriptions(userId) {
        return this.subscriptions.get(userId) || [];
    }
}
