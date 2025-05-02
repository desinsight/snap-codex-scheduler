import { User } from './auth';
import { Schedule } from './schedule';

// 기본 분석 메트릭 타입
export type MetricType = 
  | 'count'
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'rate'
  | 'ratio'
  | 'percentile';

export type TimeUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

// 분석 차원 타입
export type Dimension = 
  | 'user'
  | 'schedule'
  | 'notification'
  | 'device'
  | 'location'
  | 'browser'
  | 'platform'
  | 'timeOfDay'
  | 'dayOfWeek';

// 이벤트 타입
export type AnalyticsEventType =
  | 'page_view'
  | 'schedule_create'
  | 'schedule_update'
  | 'schedule_delete'
  | 'notification_sent'
  | 'user_login'
  | 'user_logout'
  | 'error_occurred'
  | 'feature_usage';

// 이벤트 데이터 타입
export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  timestamp: string;
  userId: string;
  sessionId: string;
  properties: Record<string, any>;
  metadata: {
    version: string;
    environment: string;
    source: string;
  };
}

// 사용자 세션 타입
export interface UserSession {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  deviceInfo: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
    screenResolution: string;
  };
  location?: {
    country: string;
    region: string;
    city: string;
  };
}

// 사용자 행동 타입
export interface UserBehavior {
  clickPatterns: Array<{
    elementId: string;
    timestamp: string;
    frequency: number;
  }>;
  scrollDepth: {
    average: number;
    distribution: Record<string, number>;
  };
  timeOnPage: {
    total: number;
    perSection: Record<string, number>;
  };
  conversion: {
    funnel: string;
    stage: string;
    completed: boolean;
    duration: number;
  };
}

// 성과 지표 타입
export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  apiLatency: Record<string, number>;
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: {
      requests: number;
      bandwidth: number;
    };
  };
}

// 트렌드 분석 타입
export interface TrendAnalysis {
  period: {
    start: Date;
    end: Date;
    unit: TimeUnit;
  };
  data: Array<{
    timestamp: Date;
    metrics: Record<string, number>;
  }>;
  trends: Array<{
    metric: string;
    change: number;
    direction: 'up' | 'down' | 'stable';
    significance: number;
  }>;
}

// 세그먼트 타입
export interface AnalyticsSegment {
  id: string;
  name: string;
  description?: string;
  criteria: Array<{
    dimension: Dimension;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: any;
  }>;
  metrics: Record<string, number>;
  size: number;
  lastUpdated: Date;
}

// 분석 필터 타입
export interface AnalyticsFilter {
  dimensions?: Dimension[];
  metrics?: string[];
  startDate?: Date;
  endDate?: Date;
  segments?: string[];
  limit?: number;
  offset?: number;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

// 분석 리포트 타입
export interface AnalyticsReport {
  timeRange: {
    start: string;
    end: string;
  };
  metrics: {
    activeUsers: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    engagement: {
      averageSessionDuration: number;
      bounceRate: number;
      returnRate: number;
    };
    features: Record<string, FeatureUsage>;
    performance: PerformanceMetrics;
    errors: {
      count: number;
      distribution: Record<string, number>;
      impact: number;
    };
  };
  trends: Array<{
    date: string;
    metrics: Record<string, number>;
  }>;
  segments: {
    userTypes: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
}

// 예측 분석 타입
export interface PredictiveAnalytics {
  userChurn: {
    risk: number;
    factors: Array<{
      name: string;
      weight: number;
    }>;
    prediction: {
      likelihood: number;
      confidence: number;
      timeframe: string;
    };
  };
  featureAdoption: {
    potential: number;
    recommendations: Array<{
      feature: string;
      score: number;
      reasoning: string;
    }>;
  };
  resourceUtilization: {
    forecast: Array<{
      timestamp: string;
      metrics: Record<string, number>;
    }>;
    anomalies: Array<{
      metric: string;
      timestamp: string;
      severity: number;
      description: string;
    }>;
  };
}

// 분석 설정 타입
export interface AnalyticsConfig {
  tracking: {
    enabled: boolean;
    anonymize: boolean;
    samplingRate: number;
    excludedRoutes: string[];
  };
  reporting: {
    automated: boolean;
    schedule: string;
    recipients: string[];
    format: 'pdf' | 'csv' | 'json';
  };
  storage: {
    retention: number;
    aggregation: {
      enabled: boolean;
      interval: string;
    };
  };
  privacy: {
    dataCollection: {
      ip: boolean;
      location: boolean;
      deviceInfo: boolean;
    };
    userConsent: {
      required: boolean;
      version: string;
    };
  };
}

// 분석 API 타입
export interface AnalyticsAPI {
  // 이벤트 추적
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
  trackPageView: (path: string, properties?: Record<string, any>) => Promise<void>;
  
  // 세션 관리
  startSession: (userId?: string) => Promise<string>;
  endSession: (sessionId: string) => Promise<void>;
  
  // 데이터 조회
  getMetrics: (filter: AnalyticsFilter) => Promise<PerformanceMetrics>;
  getTrends: (metric: string, period: { start: Date; end: Date; unit: TimeUnit }) => Promise<TrendAnalysis>;
  getSegments: (filter: AnalyticsFilter) => Promise<AnalyticsSegment[]>;
  
  // 리포트 생성
  generateReport: (config: {
    type: string;
    period: { start: Date; end: Date };
    metrics: string[];
    segments?: string[];
  }) => Promise<AnalyticsReport>;
  
  // 예측 분석
  getPredictions: (metric: string, horizon: TimeUnit) => Promise<PredictiveAnalytics>;
  
  // 데이터 내보내기
  exportData: (filter: AnalyticsFilter, format: 'csv' | 'json') => Promise<string>;
}

// Feature Usage Analytics
export interface FeatureUsage {
  featureId: string;
  featureName: string;
  usageCount: number;
  averageDuration: number;
  successRate: number;
  userSegments: Record<string, number>;
}

// Analytics Service Interface
export interface AnalyticsService {
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
  getReport: (timeRange: AnalyticsReport['timeRange']) => Promise<AnalyticsReport>;
  getPredictions: () => Promise<PredictiveAnalytics>;
  updateConfig: (config: Partial<AnalyticsConfig>) => Promise<void>;
} 