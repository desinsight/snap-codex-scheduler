import webpush from 'web-push';
import { NotificationTemplate } from '../types/notification';

export class PushNotificationService {
  private static instance: PushNotificationService;
  private subscriptions: Map<string, webpush.PushSubscription[]>;

  private constructor() {
    this.subscriptions = new Map();
    this.initializeVAPID();
  }

  private initializeVAPID(): void {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      throw new Error('VAPID keys are not configured');
    }

    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      vapidPublicKey,
      vapidPrivateKey
    );
  }

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  public async subscribeUser(userId: string, subscription: webpush.PushSubscription): Promise<void> {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, []);
    }
    this.subscriptions.get(userId)?.push(subscription);
  }

  public async unsubscribeUser(userId: string, endpoint: string): Promise<void> {
    const userSubscriptions = this.subscriptions.get(userId);
    if (userSubscriptions) {
      this.subscriptions.set(
        userId,
        userSubscriptions.filter(sub => sub.endpoint !== endpoint)
      );
    }
  }

  public async sendNotification(
    userId: string,
    content: string,
    template?: NotificationTemplate
  ): Promise<void> {
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

      const promises = subscriptions.map(subscription =>
        webpush.sendNotification(subscription, JSON.stringify(notification))
          .catch(error => {
            if (error.statusCode === 410) {
              // 구독이 만료된 경우 제거
              this.unsubscribeUser(userId, subscription.endpoint);
            }
            console.error('Failed to send push notification:', error);
          })
      );

      await Promise.all(promises);
      console.log(`Push notification sent to user ${userId}`);
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  public getVAPIDPublicKey(): string {
    return process.env.VAPID_PUBLIC_KEY || '';
  }

  public getUserSubscriptions(userId: string): webpush.PushSubscription[] {
    return this.subscriptions.get(userId) || [];
  }
} 