import { NotificationPriority } from './notification';

export enum ScheduleCategory {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  OTHER = 'OTHER',
}

export enum SchedulePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ScheduleStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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
  startDate: Date;
  endDate: Date;
  category: ScheduleCategory;
  priority: SchedulePriority;
  status: ScheduleStatus;
  isAllDay: boolean;
  isShared: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  location?: string;
  participants?: string[];
  notificationSettings?: {
    type: NotificationType[];
    reminderBefore: number; // minutes
  };
  assignedTo?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface ScheduleFilter {
  category?: ScheduleCategory[];
  priority?: SchedulePriority[];
  status?: ScheduleStatus[];
  assignedTo?: string[];
  createdBy?: string[];
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  isShared?: boolean;
}

export interface ScheduleStats {
  total: number;
  byCategory: {
    [key in ScheduleCategory]: number;
  };
  byPriority: {
    [key in SchedulePriority]: number;
  };
  byStatus: {
    [key in ScheduleStatus]: number;
  };
  upcoming: number;
  completed: number;
  shared: number;
  averageCompletionTime: number;
  participationRate: number;
}

export interface ScheduleState {
  schedules: {
    ids: string[];
    entities: Record<string, Schedule>;
  };
  currentScheduleId: string | null;
  loading: boolean;
  error: string | null;
  stats: ScheduleStats | null;
}

export interface ScheduleImportData {
  schedules: Schedule[];
  metadata: {
    version: string;
    exportedAt: Date;
    exportedBy: string;
  };
}

export interface ScheduleExportOptions {
  format: 'json' | 'csv';
  includeMetadata: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: ScheduleCategory[];
  statuses?: ScheduleStatus[];
}
