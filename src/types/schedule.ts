export interface Schedule {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  category: ScheduleCategory;
  repeat?: ScheduleRepeat;
  notification?: ScheduleNotification;
  isShared: boolean;
  sharedWith?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ScheduleCategory {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  OTHER = 'OTHER'
}

export interface ScheduleRepeat {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  endDate?: Date;
  exceptions?: Date[];
}

export interface ScheduleNotification {
  type: 'EMAIL' | 'PUSH' | 'BOTH';
  minutesBefore: number;
  isEnabled: boolean;
}

export interface ScheduleFilter {
  startDate?: Date;
  endDate?: Date;
  category?: ScheduleCategory;
  isShared?: boolean;
  searchText?: string;
}

export interface ScheduleStats {
  total: number;
  byCategory: Record<ScheduleCategory, number>;
  upcoming: number;
  completed: number;
  shared: number;
} 