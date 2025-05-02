export enum NotificationType {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  versions: NotificationTemplateVersion[];
  usage: {
    total: number;
    success: number;
    failed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplateVersion {
  id: string;
  content: string;
  version: number;
  createdAt: Date;
}

export interface NotificationPreference {
  userId: string;
  types: NotificationType[];
  channels: {
    [key in NotificationType]: boolean;
  };
  schedule: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationHistory {
  id: string;
  userId: string;
  templateId: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
}

export interface NotificationStats {
  total: number;
  byType: {
    [key in NotificationType]: number;
  };
  byStatus: {
    [key in NotificationStatus]: number;
  };
  byPriority: {
    [key in NotificationPriority]: number;
  };
  deliveryRate: number;
  readRate: number;
  averageDeliveryTime: number;
}

export interface UserBehaviorPattern {
  userId: string;
  patterns: {
    preferredChannels: NotificationType[];
    activeHours: {
      start: string;
      end: string;
      days: number[];
    };
    responseRates: {
      [key in NotificationType]: number;
    };
    categories: {
      name: string;
      engagement: number;
    }[];
  };
  lastUpdated: Date;
}

export interface SmartNotificationSettings {
  userId: string;
  enabled: boolean;
  rules: {
    condition: string;
    action: string;
    priority: number;
  }[];
  learningRate: number;
  lastOptimized: Date;
}

export interface NotificationFatigue {
  userId: string;
  level: number;
  threshold: number;
  cooldown: number;
  lastNotification: Date;
}

export interface NotificationAnalyticsState {
  stats: NotificationStats;
  userPatterns: UserBehaviorPattern[];
  smartSettings: SmartNotificationSettings[];
  fatigueLevels: NotificationFatigue[];
  loading: boolean;
  error: string | null;
}

export interface MonitoringDashboard {
  metrics: {
    deliveryRate: number;
    readRate: number;
    averageResponseTime: number;
    failureRate: number;
  };
  alerts: {
    id: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: Date;
  }[];
  performance: {
    cpu: number;
    memory: number;
    latency: number;
  };
  status: {
    service: 'healthy' | 'degraded' | 'down';
    lastCheck: Date;
    uptime: number;
  };
}

export interface MonitoringState {
  dashboard: MonitoringDashboard | null;
  loading: boolean;
  error: string | null;
}

export interface AutomationRule {
  id: string;
  name: string;
  conditions: {
    type: string;
    value: any;
  }[];
  actions: {
    type: string;
    params: Record<string, any>;
  }[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationState {
  rules: AutomationRule[];
  loading: boolean;
  error: string | null;
}

export interface NotificationOptimizationState {
  recommendations: {
    id: string;
    type: 'channel' | 'timing' | 'content' | 'priority';
    description: string;
    impact: 'high' | 'medium' | 'low';
    implementation: string;
  }[];
  loading: boolean;
  error: string | null;
}

export interface ResponseAnalysisState {
  reports: {
    id: string;
    period: string;
    metrics: {
      responseRate: number;
      averageTime: number;
      engagement: number;
    };
    insights: string[];
    recommendations: string[];
  }[];
  loading: boolean;
  error: string | null;
}

export interface ChannelOptimizationState {
  channels: {
    type: NotificationType;
    performance: {
      deliveryRate: number;
      readRate: number;
      responseTime: number;
    };
    cost: number;
    recommendation: string;
  }[];
  loading: boolean;
  error: string | null;
}

export interface UserPreferencesState {
  preferences: NotificationPreference[];
  loading: boolean;
  error: string | null;
}

export interface NotificationTemplateState {
  templates: NotificationTemplate[];
  loading: boolean;
  error: string | null;
}

export interface NotificationGroup {
  id: string;
  name: string;
  description?: string;
  scheduleIds: string[];
  settings: {
    type: NotificationType;
    time: NotificationTime;
    priority: NotificationPriority;
    templateId?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationGroupState {
  groups: NotificationGroup[];
  loading: boolean;
  error: string | null;
}

export interface TemplatePreviewData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  createdBy: string;
}

export interface TemplateImportExport {
  templates: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>[];
  version: string;
  exportedAt: string;
}

export type NotificationTime = '5' | '10' | '15' | '30' | '60' | '120' | '1440';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  scheduleId?: string;
  userId: string;
  createdAt: Date;
  readAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface FollowUpRule {
  id: string;
  name: string;
  conditions: {
    type: string;
    value: any;
  }[];
  actions: {
    type: string;
    params: Record<string, any>;
  }[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUpAutomationState {
  rules: FollowUpRule[];
  loading: boolean;
  error: string | null;
}

export interface UserBehaviorState {
  patterns: UserBehaviorPattern[];
  loading: boolean;
  error: string | null;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: NotificationType;
  status: 'active' | 'inactive' | 'error';
  lastChecked: Date;
  error?: string;
  metrics: {
    successRate: number;
    averageDeliveryTime: number;
    totalSent: number;
    totalFailed: number;
  };
}

export interface NotificationResponse {
  id: string;
  notificationId: string;
  userId: string;
  channel: NotificationChannel;
  responseType: 'read' | 'click' | 'dismiss' | 'ignore';
  responseTime: Date;
  metadata?: Record<string, any>;
}

export interface FollowUpNotification {
  id: string;
  originalNotificationId: string;
  userId: string;
  channel: NotificationChannel;
  content: string;
  scheduledTime: Date;
  status: 'pending' | 'sent' | 'failed';
  retryCount: number;
  maxRetries: number;
}

export interface ChannelTemplate {
  id: string;
  channel: NotificationChannel;
  name: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  priority: NotificationPriority;
}

export interface ChannelStatus {
  channel: NotificationChannel;
  status: 'active' | 'inactive' | 'error';
  lastChecked: Date;
  error?: string;
  metrics: {
    successRate: number;
    averageDeliveryTime: number;
    totalSent: number;
    totalFailed: number;
  };
}

export interface ChannelSwitchRule {
  id: string;
  sourceChannel: NotificationChannel;
  targetChannel: NotificationChannel;
  conditions: {
    failureCount: number;
    timeSinceLastAttempt: number;
    priority: NotificationPriority;
  };
  isActive: boolean;
}

export interface NotificationResponseState {
  responses: NotificationResponse[];
  followUps: FollowUpNotification[];
  channelTemplates: ChannelTemplate[];
  channelStatuses: ChannelStatus[];
  channelSwitchRules: ChannelSwitchRule[];
  loading: boolean;
  error: string | null;
}

export interface AnalysisState {
  reports: PerformanceReport[];
  currentReport: PerformanceReport | null;
  loading: boolean;
  error: string | null;
}

export interface PerformanceReport {
  id: string;
  period: {
    start: Date;
    end: Date;
  };
  type: 'weekly' | 'monthly';
  metrics: {
    totalNotifications: number;
    successRate: number;
    averageResponseTime: number;
    channelPerformance: {
      channel: NotificationType;
      successRate: number;
      averageResponseTime: number;
      totalSent: number;
      totalFailed: number;
    }[];
    userEngagement: {
      userId: string;
      responseRate: number;
      averageResponseTime: number;
      preferredChannels: NotificationType[];
    }[];
  };
  recommendations: {
    type: 'channel' | 'timing' | 'content' | 'priority';
    description: string;
    impact: 'high' | 'medium' | 'low';
    implementation: string;
  }[];
  createdAt: Date;
}

export enum ScheduleCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  EDUCATION = 'education',
  HEALTH = 'health',
  SYSTEM = 'system'
}

// 기본 알림 템플릿
export const defaultTemplates: NotificationTemplate[] = [
  {
    id: 'task-assigned',
    name: 'Task Assigned',
    type: NotificationType.EMAIL,
    subject: 'New Task Assigned',
    content: 'A new task has been assigned to you',
    variables: ['taskName', 'assignerName'],
    isDefault: true,
    versions: [],
    usage: {
      total: 0,
      success: 0,
      failed: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'task-completed',
    name: 'Task Completed',
    type: NotificationType.EMAIL,
    subject: 'Task Completed',
    content: 'A task has been marked as completed',
    variables: ['taskName', 'completerName'],
    isDefault: true,
    versions: [],
    usage: {
      total: 0,
      success: 0,
      failed: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'schedule-reminder',
    name: 'Schedule Reminder',
    type: NotificationType.EMAIL,
    subject: 'Upcoming Schedule',
    content: 'A schedule is coming up soon',
    variables: ['scheduleTitle', 'startTime'],
    isDefault: true,
    versions: [],
    usage: {
      total: 0,
      success: 0,
      failed: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'system-alert',
    name: 'System Alert',
    type: NotificationType.EMAIL,
    subject: 'System Alert',
    content: 'An important system alert has been issued',
    variables: ['alertType', 'severity'],
    isDefault: true,
    versions: [],
    usage: {
      total: 0,
      success: 0,
      failed: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
