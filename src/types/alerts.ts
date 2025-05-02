export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertChannel = 'email' | 'slack' | 'webhook' | 'inApp';
export type AlertStatus = 'active' | 'resolved' | 'acknowledged';

export interface AlertThreshold {
  metric: string;
  operator: '>' | '<' | '>=' | '<=' | '==';
  value: number;
  duration: number; // 지속 시간(초)
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  priority: AlertPriority;
  thresholds: AlertThreshold[];
  channels: AlertChannel[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AlertNotification {
  id: string;
  ruleId: string;
  message: string;
  priority: AlertPriority;
  status: AlertStatus;
  timestamp: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  metadata: {
    metric: string;
    value: number;
    threshold: number;
  };
}

export interface AlertChannelConfig {
  email?: {
    recipients: string[];
    templateId?: string;
  };
  slack?: {
    webhookUrl: string;
    channel: string;
  };
  webhook?: {
    url: string;
    headers?: Record<string, string>;
  };
}

export interface AlertStats {
  total: number;
  active: number;
  resolved: number;
  acknowledged: number;
  byPriority: Record<AlertPriority, number>;
} 