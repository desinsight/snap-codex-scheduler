import { Schedule } from '../types/schedule';

class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.requestPermission();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async requestPermission(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return;
    }

    try {
      this.permission = await Notification.requestPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  public async showNotification(schedule: Schedule, minutesBefore: number): Promise<void> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const notification = new Notification(schedule.title, {
      body: `${schedule.description}\n${minutesBefore} minutes before the event`,
      icon: '/notification-icon.png',
      badge: '/notification-badge.png',
      tag: `schedule-${schedule.id}`,
      renotify: true,
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  public async scheduleNotification(schedule: Schedule, minutesBefore: number): Promise<void> {
    const now = new Date();
    const scheduleTime = new Date(schedule.startDate);
    const notificationTime = new Date(scheduleTime.getTime() - minutesBefore * 60000);

    if (notificationTime <= now) {
      console.warn('Notification time is in the past');
      return;
    }

    const delay = notificationTime.getTime() - now.getTime();
    setTimeout(() => {
      this.showNotification(schedule, minutesBefore);
    }, delay);
  }
}

export default NotificationService; 