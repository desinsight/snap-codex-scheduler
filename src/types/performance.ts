import { ReactElement } from 'react';

// 기본 성능 메트릭 타입
export type MetricName = 
  | 'FCP' // First Contentful Paint
  | 'LCP' // Largest Contentful Paint
  | 'FID' // First Input Delay
  | 'CLS' // Cumulative Layout Shift
  | 'TTFB' // Time to First Byte
  | 'TTI'; // Time to Interactive

export type MetricValue = number;
export type MetricUnit = 'ms' | 's' | 'score' | 'bytes' | 'percent';

// 성능 메트릭 데이터 타입
export interface PerformanceMetric {
  name: MetricName;
  value: MetricValue;
  unit: MetricUnit;
  timestamp: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// 웹 바이탈 메트릭 타입
export interface WebVitalsMetrics {
  fcp: PerformanceMetric;
  lcp: PerformanceMetric;
  fid: PerformanceMetric;
  cls: PerformanceMetric;
  ttfb: PerformanceMetric;
  tti: PerformanceMetric;
}

// 리소스 타이밍 타입
export interface ResourceTiming {
  name: string;
  initiatorType: string;
  startTime: number;
  duration: number;
  transferSize: number;
  decodedBodySize: number;
  encodedBodySize: number;
}

// 컴포넌트 성능 메트릭 타입
export interface ComponentMetrics {
  name: string;
  renderCount: number;
  renderTime: number;
  mountTime: number;
  updateTime: number;
  unmountTime: number;
  errorCount: number;
  lastRendered: number;
  props: Record<string, any>;
}

// 라우트 성능 메트릭 타입
export interface RouteMetrics {
  path: string;
  loadTime: number;
  renderTime: number;
  resourceCount: number;
  errorCount: number;
  redirectCount: number;
}

// API 성능 메트릭 타입
export interface ApiMetrics {
  endpoint: string;
  method: string;
  requestTime: number;
  responseTime: number;
  statusCode: number;
  payloadSize: number;
  cacheHit: boolean;
  retryCount: number;
}

// 메모리 사용량 메트릭 타입
export interface MemoryMetrics {
  jsHeapSize: number;
  jsHeapSizeLimit: number;
  usedJsHeapSize: number;
  domNodes: number;
  listeners: number;
  resources: number;
}

// 에러 메트릭 타입
export interface ErrorMetrics {
  type: string;
  message: string;
  count: number;
  firstOccurrence: number;
  lastOccurrence: number;
  componentStack?: string;
  browserInfo?: {
    userAgent: string;
    platform: string;
    language: string;
  };
}

// 사용자 상호작용 메트릭 타입
export interface InteractionMetrics {
  type: string;
  target: string;
  duration: number;
  startTime: number;
  endTime: number;
  status: 'success' | 'error' | 'timeout';
}

// 네트워크 성능 메트릭 타입
export interface NetworkMetrics {
  downlink: number;
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  rtt: number;
  saveData: boolean;
  throughput: number;
  failures: number;
}

// 성능 모니터링 설정 타입
export interface PerformanceMonitorConfig {
  sampleRate: number;
  enableWebVitals: boolean;
  enableResourceTiming: boolean;
  enableUserTiming: boolean;
  enableErrorTracking: boolean;
  enableNetworkMonitoring: boolean;
  maxStorageSize: number;
  flushInterval: number;
  reportingEndpoint?: string;
  tags?: Record<string, string>;
}

// 성능 데이터 수집기 타입
export interface PerformanceCollector {
  start: () => void;
  stop: () => void;
  clear: () => void;
  getMetrics: () => PerformanceReport;
  observe: (metric: MetricName, callback: (value: MetricValue) => void) => void;
  unobserve: (metric: MetricName) => void;
}

// 성능 마크 및 측정 타입
export interface PerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
  detail?: any;
}

// 성능 보고서 타입
export interface PerformanceReport {
  timestamp: number;
  webVitals: WebVitalsMetrics;
  resources: ResourceTiming[];
  components: ComponentMetrics[];
  routes: RouteMetrics[];
  api: ApiMetrics[];
  memory: MemoryMetrics;
  errors: ErrorMetrics[];
  interactions: InteractionMetrics[];
  network: NetworkMetrics;
  marks: PerformanceMark[];
}

// 성능 분석 결과 타입
export interface PerformanceAnalysis {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    metric: MetricName;
    current: MetricValue;
    threshold: MetricValue;
    recommendation: string;
  }>;
  trends: Record<MetricName, {
    current: MetricValue;
    previous: MetricValue;
    change: number;
    direction: 'up' | 'down' | 'stable';
  }>;
}

// 성능 모니터링 훅 타입
export interface UsePerformanceMonitor {
  metrics: PerformanceReport;
  startTracking: (component: ReactElement) => void;
  stopTracking: (component: ReactElement) => void;
  clearMetrics: () => void;
  getAnalysis: () => PerformanceAnalysis;
}

// 성능 최적화 제안 타입
export interface PerformanceOptimizationSuggestion {
  type: 'code-splitting' | 'caching' | 'compression' | 'image-optimization' | 'lazy-loading';
  impact: 'high' | 'medium' | 'low';
  description: string;
  implementation: string;
  estimatedImprovement: {
    metric: MetricName;
    value: number;
    unit: MetricUnit;
  };
}

// 성능 알림 타입
export interface PerformanceAlert {
  type: 'warning' | 'critical' | 'info';
  metric: MetricName;
  threshold: MetricValue;
  current: MetricValue;
  timestamp: number;
  message: string;
  component?: string;
  route?: string;
}

// 성능 대시보드 데이터 타입
export interface PerformanceDashboardData {
  summary: {
    score: number;
    rating: string;
    criticalIssues: number;
    warnings: number;
  };
  metrics: WebVitalsMetrics;
  trends: Record<MetricName, Array<{
    timestamp: number;
    value: MetricValue;
  }>>;
  topIssues: PerformanceAlert[];
  suggestions: PerformanceOptimizationSuggestion[];
  components: ComponentMetrics[];
  resources: ResourceTiming[];
} 