import NotificationService from './notificationService';
import { Schedule } from '../types/schedule';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockSchedule: Schedule;

  beforeEach(() => {
    notificationService = NotificationService.getInstance();
    mockSchedule = {
      id: '1',
      title: 'Test Schedule',
      description: 'Test Description',
      startDate: new Date('2024-03-20T10:00:00'),
      endDate: new Date('2024-03-20T11:00:00'),
      isAllDay: false,
      category: 'work',
      isShared: false,
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock Notification API
    global.Notification = {
      requestPermission: jest.fn().mockResolvedValue('granted'),
      permission: 'granted',
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be a singleton', () => {
    const instance1 = NotificationService.getInstance();
    const instance2 = NotificationService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should request notification permission on initialization', async () => {
    const mockRequestPermission = jest.fn().mockResolvedValue('granted');
    global.Notification.requestPermission = mockRequestPermission;

    new NotificationService();
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it('should show notification when permission is granted', async () => {
    const mockNotification = {
      onclick: jest.fn(),
      close: jest.fn(),
    };
    const mockNotificationConstructor = jest.fn().mockReturnValue(mockNotification);
    global.Notification = mockNotificationConstructor as any;

    await notificationService.showNotification(mockSchedule, 10);

    expect(mockNotificationConstructor).toHaveBeenCalledWith('Test Schedule', {
      body: 'Test Description\n10 minutes before the event',
      icon: '/notification-icon.png',
      badge: '/notification-badge.png',
      tag: 'schedule-1',
      renotify: true,
      requireInteraction: true,
    });
  });

  it('should not show notification when permission is denied', async () => {
    global.Notification.permission = 'denied';
    const mockNotificationConstructor = jest.fn();
    global.Notification = mockNotificationConstructor as any;

    await notificationService.showNotification(mockSchedule, 10);

    expect(mockNotificationConstructor).not.toHaveBeenCalled();
  });

  it('should schedule notification for future time', async () => {
    jest.useFakeTimers();
    const mockShowNotification = jest.fn();
    notificationService.showNotification = mockShowNotification;

    const now = new Date('2024-03-20T09:00:00');
    jest.setSystemTime(now);

    await notificationService.scheduleNotification(mockSchedule, 10);

    expect(mockShowNotification).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50 * 60 * 1000); // Advance 50 minutes

    expect(mockShowNotification).toHaveBeenCalledWith(mockSchedule, 10);
  });

  it('should not schedule notification for past time', async () => {
    const mockShowNotification = jest.fn();
    notificationService.showNotification = mockShowNotification;

    const now = new Date('2024-03-20T11:00:00');
    jest.setSystemTime(now);

    await notificationService.scheduleNotification(mockSchedule, 10);

    expect(mockShowNotification).not.toHaveBeenCalled();
  });

  it('should handle notification click', async () => {
    const mockNotification = {
      onclick: jest.fn(),
      close: jest.fn(),
    };
    const mockNotificationConstructor = jest.fn().mockReturnValue(mockNotification);
    global.Notification = mockNotificationConstructor as any;
    global.window.focus = jest.fn();

    await notificationService.showNotification(mockSchedule, 10);

    mockNotification.onclick();

    expect(global.window.focus).toHaveBeenCalled();
    expect(mockNotification.close).toHaveBeenCalled();
  });
});
