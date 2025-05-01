import {
  BaseModel,
  Status,
  UserRole,
  CalendarPreferences,
  NotificationPreferences,
} from '../common';

export interface Task extends BaseModel {
  taskId: string;
  projectId: string;
  title: string;
  description?: string;
  taskDate: Date;
  status: Status;
  type: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  notes: Note[];
  attachments?: string[];
  tags?: string[];
}

export interface Note extends BaseModel {
  noteId: string;
  taskId: string;
  content: string;
  author: string;
  attachments?: string[];
}

export interface User extends BaseModel {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  calendarPrefs: CalendarPreferences;
  notificationPrefs: NotificationPreferences;
  projects: string[];
  avatar?: string;
}

export interface Project extends BaseModel {
  projectId: string;
  name: string;
  description?: string;
  owner: string;
  members: string[];
  tasks: string[];
  status: Status;
  startDate: Date;
  endDate?: Date;
  progress: number;
}
