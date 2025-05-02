export type NotificationType = 'BROWSER' | 'EMAIL' | 'BOTH';

export type NotificationTime = '5' | '10' | '15' | '30' | '60' | '120' | '1440';

export interface NotificationSettings {
  id: string;
  scheduleId: string;
  type: NotificationType;
  time: NotificationTime;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationHistory {
  id: string;
  eventId: string;
  eventTitle: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
}

export type NotificationTemplateType = 'email' | 'browser';

export type NotificationTemplateCategory = 'work' | 'personal' | 'education' | 'health' | 'system';

export interface TemplateVersion {
  id: string;
  version: string;
  content: string;
  subject?: string;
  createdAt: Date;
  createdBy: string;
  changes: string;
}

export interface TemplateUsage {
  total: number;
  success: number;
  failed: number;
  lastUsedAt?: Date;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationTemplateType;
  name: string;
  category: NotificationTemplateCategory;
  subject?: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  versions: TemplateVersion[];
  usage: TemplateUsage;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationTemplateState {
  templates: NotificationTemplate[];
  loading: boolean;
  error: string | null;
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
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

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  byCategory: Record<NotificationTemplateCategory, number>;
}

export interface UserBehaviorPattern {
  userId: string;
  responsePatterns: {
    timeOfDay: {
      hour: number;
      responseRate: number;
      averageResponseTime: number;
    }[];
    channelPreferences: {
      channel: NotificationChannel;
      successRate: number;
      averageResponseTime: number;
      totalResponses: number;
    }[];
    priorityPatterns: {
      priority: NotificationPriority;
      responseRate: number;
      averageResponseTime: number;
      totalResponses: number;
    }[];
  };
  engagementMetrics: {
    totalNotifications: number;
    totalResponses: number;
    averageResponseTime: number;
    responseRate: number;
  };
  lastUpdated: string;
}

export interface UserBehaviorState {
  patterns: UserBehaviorPattern[];
  loading: boolean;
  error: string | null;
}

export interface NotificationFatigue {
  userId: string;
  dailyNotificationCount: number;
  fatigueScore: number;
  lastNotificationTime: Date;
  cooldownPeriod: number;
}

export interface SmartNotificationSettings {
  userId: string;
  optimalNotificationTime: {
    start: number;
    end: number;
  };
  preferredChannels: NotificationType[];
  priorityThresholds: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  feedbackScore: number;
  autoAdjustmentEnabled: boolean;
}

export interface NotificationAnalyticsState {
  stats: NotificationStats;
  userPatterns: UserBehaviorPattern[];
  fatigueLevels: NotificationFatigue[];
  smartSettings: SmartNotificationSettings[];
  loading: boolean;
  error: string | null;
}

export type NotificationChannel = 'email' | 'sms' | 'push' | 'browser';

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

export interface ResponseAnalysisReport {
  id: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalResponses: number;
    averageResponseTime: number;
    responseRate: number;
    channelDistribution: {
      channel: NotificationChannel;
      count: number;
      percentage: number;
    }[];
  };
  userEngagement: {
    userId: string;
    responseCount: number;
    averageResponseTime: number;
    preferredChannel: NotificationChannel;
    engagementScore: number;
  }[];
  channelPerformance: {
    channel: NotificationChannel;
    successRate: number;
    averageDeliveryTime: number;
    failureReasons: {
      reason: string;
      count: number;
    }[];
  }[];
  trends: {
    date: Date;
    responseCount: number;
    averageResponseTime: number;
  }[];
  recommendations: {
    channel: NotificationChannel;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  createdAt: Date;
}

export interface ResponseAnalysisState {
  reports: ResponseAnalysisReport[];
  currentReport: ResponseAnalysisReport | null;
  loading: boolean;
  error: string | null;
}

export interface FollowUpRule {
  id: string;
  name: string;
  conditions: {
    responseType: 'read' | 'click' | 'dismiss' | 'ignore';
    timeSinceNotification: number;
    priority: NotificationPriority;
  };
  actions: {
    channel: NotificationChannel;
    templateId: string;
    delay: number;
    maxRetries: number;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUpAutomationState {
  rules: FollowUpRule[];
  loading: boolean;
  error: string | null;
}

export interface NotificationRecommendation {
  id: string;
  userId: string;
  optimalTime: {
    start: string;
    end: string;
  };
  preferredChannels: NotificationChannel[];
  responseRate: number;
  averageResponseTime: number;
  lastUpdated: string;
}

export interface NotificationOptimizationState {
  recommendations: NotificationRecommendation[];
  loading: boolean;
  error: string | null;
}

export interface AutomationRule {
  id: string;
  name: string;
  type: 'channelSwitch' | 'priorityAdjustment' | 'retryStrategy' | 'fatigueManagement';
  conditions: {
    metric: string;
    operator: '>' | '<' | '>=' | '<=' | '==';
    value: number;
    timeWindow?: number;
  }[];
  actions: {
    type: string;
    value: any;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
      channel: NotificationChannel;
      successRate: number;
      averageResponseTime: number;
      totalSent: number;
      totalFailed: number;
    }[];
    userEngagement: {
      userId: string;
      responseRate: number;
      averageResponseTime: number;
      preferredChannels: NotificationChannel[];
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

export interface MonitoringDashboard {
  realtimeMetrics: {
    notificationsPerMinute: number;
    successRate: number;
    averageResponseTime: number;
    activeChannels: NotificationChannel[];
  };
  channelStatus: {
    channel: NotificationChannel;
    status: 'active' | 'inactive' | 'error';
    lastChecked: Date;
    metrics: {
      successRate: number;
      averageDeliveryTime: number;
      totalSent: number;
      totalFailed: number;
    };
  }[];
  activeRules: AutomationRule[];
  recentNotifications: {
    id: string;
    userId: string;
    channel: NotificationChannel;
    status: 'success' | 'failed';
    timestamp: Date;
  }[];
}

export interface AutomationState {
  rules: AutomationRule[];
  loading: boolean;
  error: string | null;
}

export interface AnalysisState {
  reports: PerformanceReport[];
  currentReport: PerformanceReport | null;
  loading: boolean;
  error: string | null;
}

export interface MonitoringState {
  dashboard: MonitoringDashboard | null;
  loading: boolean;
  error: string | null;
}

export interface UserNotificationPreferences {
  userId: string;
  preferredChannels: NotificationChannel[];
  notificationTimes: {
    start: number; // hour (0-23)
    end: number; // hour (0-23)
  };
  priorityThresholds: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  maxDailyNotifications: number;
  doNotDisturb: {
    enabled: boolean;
    start: number; // hour (0-23)
    end: number; // hour (0-23)
  };
  feedback: {
    lastFeedback: Date;
    satisfactionScore: number; // 1-5
    feedbackText?: string;
  };
  learning: {
    lastUpdated: Date;
    responseRate: number;
    averageResponseTime: number;
    channelPreferences: {
      channel: NotificationChannel;
      successRate: number;
      preferenceScore: number; // 0-1
    }[];
  };
}

export interface UserPreferencesState {
  preferences: UserNotificationPreferences[];
  loading: boolean;
  error: string | null;
}

export interface SecuritySettings {
  encryption: {
    enabled: boolean;
    algorithm: 'AES-256' | 'RSA-2048';
    keyRotationInterval: number; // days
    lastRotation: Date;
  };
  accessControl: {
    roleBased: boolean;
    roles: {
      admin: string[];
      manager: string[];
      user: string[];
    };
    permissions: {
      read: string[];
      write: string[];
      delete: string[];
    };
  };
  auditLog: {
    enabled: boolean;
    retentionPeriod: number; // days
    logLevel: 'info' | 'warning' | 'error';
  };
}

export interface BackupSettings {
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // HH:mm
    lastBackup: Date;
  };
  retention: {
    period: number; // days
    maxBackups: number;
  };
  storage: {
    type: 'local' | 'cloud' | 'hybrid';
    location: string;
    encryption: boolean;
  };
}

export interface ErrorHandling {
  retryPolicy: {
    maxAttempts: number;
    backoffInterval: number; // seconds
    exponential: boolean;
  };
  fallbackStrategy: {
    enabled: boolean;
    alternativeChannels: NotificationChannel[];
    timeout: number; // seconds
  };
  monitoring: {
    enabled: boolean;
    alertThreshold: number; // percentage
    notificationChannels: NotificationChannel[];
  };
}

export interface SecurityState {
  settings: SecuritySettings;
  backup: BackupSettings;
  errorHandling: ErrorHandling;
  loading: boolean;
  error: string | null;
}

export type NotificationTiming = {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
};

export interface NotificationPreference {
  enabled: boolean;
  type: NotificationType;
  timing: NotificationTiming[];
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

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
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime?: string; // HH:mm format
    endTime?: string; // HH:mm format
  };
  categories: {
    [key in NotificationTemplateCategory]: boolean;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  type: NotificationType;
  category: NotificationTemplateCategory;
}

export interface ScheduleCategory {
  // Add appropriate properties for ScheduleCategory
}
