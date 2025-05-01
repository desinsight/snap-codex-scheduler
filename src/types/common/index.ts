export type Status = 'pending' | 'in_progress' | 'completed';
export type UserRole = 'user' | 'admin' | 'collab';

export interface CalendarPreferences {
  defaultView: 'week' | 'month';
  startOfWeek: 0 | 1; // 0: Sunday, 1: Monday
  workingHours: {
    start: string;
    end: string;
  };
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  taskReminder: boolean;
  statusChange: boolean;
  newNote: boolean;
}

export interface BaseModel {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
