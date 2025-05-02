export enum ScheduleCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  MEETING = 'meeting',
  OTHER = 'other',
}

export enum ScheduleStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  IN_APP = 'in_app',
}

export interface Schedule {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  category: ScheduleCategory;
  status: ScheduleStatus;
  location?: string;
  participants?: string[];
  notificationSettings?: {
    type: NotificationType[];
    reminderBefore: number; // minutes
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleFilter {
  startDate?: Date;
  endDate?: Date;
  category?: ScheduleCategory;
  status?: ScheduleStatus;
  search?: string;
}

export interface ScheduleStats {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  byCategory: Record<ScheduleCategory, number>;
}
