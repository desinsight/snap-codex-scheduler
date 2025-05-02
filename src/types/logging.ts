// 로그 레벨 타입
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

// 로그 카테고리 타입
export type LogCategory = 
  | 'system'
  | 'security'
  | 'performance'
  | 'user'
  | 'api'
  | 'database'
  | 'network'
  | 'ui'
  | 'business';

// 로그 소스 타입
export interface LogSource {
  file?: string;
  function?: string;
  line?: number;
  component?: string;
  service?: string;
}

// 로그 컨텍스트 타입
export interface LogContext {
  requestId?: string;
  sessionId?: string;
  userId?: string;
  timestamp: number;
  environment: 'development' | 'staging' | 'production';
  version: string;
  browser?: {
    name: string;
    version: string;
    os: string;
    device: string;
  };
}

// 로그 메타데이터 타입
export interface LogMetadata {
  category: LogCategory;
  tags?: string[];
  correlationId?: string;
  source: LogSource;
  context: LogContext;
  duration?: number;
  stack?: string;
}

// 기본 로그 엔트리 타입
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  metadata: LogMetadata;
  timestamp: number;
  data?: any;
}

// 에러 로그 타입
export interface ErrorLogEntry extends LogEntry {
  level: 'error';
  error: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    cause?: any;
  };
  context: {
    action?: string;
    state?: any;
    inputs?: any;
  };
}

// 성능 로그 타입
export interface PerformanceLogEntry extends LogEntry {
  level: 'info';
  metrics: {
    duration: number;
    memory?: number;
    cpu?: number;
    network?: {
      requestSize?: number;
      responseSize?: number;
      latency?: number;
    };
  };
}

// 사용자 활동 로그 타입
export interface UserActivityLogEntry extends LogEntry {
  level: 'info';
  user: {
    id: string;
    email?: string;
    role?: string;
  };
  activity: {
    type: string;
    target?: string;
    result: 'success' | 'failure';
    details?: any;
  };
}

// API 로그 타입
export interface ApiLogEntry extends LogEntry {
  level: 'info' | 'error';
  api: {
    method: string;
    url: string;
    status: number;
    duration: number;
    request?: {
      headers?: Record<string, string>;
      body?: any;
      query?: Record<string, string>;
    };
    response?: {
      headers?: Record<string, string>;
      body?: any;
    };
  };
}

// 로그 필터 타입
export interface LogFilter {
  level?: LogLevel[];
  category?: LogCategory[];
  startDate?: Date;
  endDate?: Date;
  search?: string;
  tags?: string[];
  userId?: string;
  requestId?: string;
  limit?: number;
  offset?: number;
}

// 로그 트랜스포트 타입
export type LogTransportType = 'console' | 'file' | 'http' | 'elasticsearch' | 'cloudwatch';

export interface LogTransport {
  type: LogTransportType;
  level: LogLevel;
  format: 'json' | 'text' | 'pretty';
  options?: {
    filename?: string;
    maxSize?: number;
    maxFiles?: number;
    url?: string;
    headers?: Record<string, string>;
    compress?: boolean;
    encrypt?: boolean;
  };
}

// 로그 포맷터 타입
export interface LogFormatter {
  format: (entry: LogEntry) => string | object;
  formatError?: (error: Error) => object;
  formatStack?: (stack: string) => string;
  formatMetadata?: (metadata: LogMetadata) => object;
}

// 로그 설정 타입
export interface LoggerConfig {
  appName: string;
  level: LogLevel;
  enabled: boolean;
  transports: LogTransport[];
  formatter?: LogFormatter;
  filters?: LogFilter;
  maxEntries?: number;
  flushInterval?: number;
  errorHandling?: {
    retryAttempts: number;
    retryDelay: number;
    fallbackTransport?: LogTransport;
  };
}

// 로그 저장소 타입
export interface LogStorage {
  save: (entry: LogEntry) => Promise<void>;
  query: (filter: LogFilter) => Promise<LogEntry[]>;
  clear: (filter?: LogFilter) => Promise<void>;
  stats: () => Promise<{
    totalEntries: number;
    errorCount: number;
    averageSize: number;
  }>;
}

// 로그 분석기 타입
export interface LogAnalyzer {
  analyze: (entries: LogEntry[]) => Promise<{
    errorRate: number;
    averageResponseTime: number;
    topErrors: ErrorLogEntry[];
    userActivitySummary: Record<string, number>;
    performanceMetrics: {
      p50: number;
      p90: number;
      p99: number;
    };
  }>;
}

// 로그 모니터 타입
export interface LogMonitor {
  watch: (pattern: LogFilter, callback: (entry: LogEntry) => void) => void;
  alert: (condition: {
    level?: LogLevel;
    pattern?: RegExp;
    threshold?: number;
    interval?: number;
  }, action: (entries: LogEntry[]) => void) => void;
  unwatch: (pattern: LogFilter) => void;
}

// 로거 인터페이스
export interface Logger {
  error: (message: string, metadata?: Partial<LogMetadata>, error?: Error) => void;
  warn: (message: string, metadata?: Partial<LogMetadata>) => void;
  info: (message: string, metadata?: Partial<LogMetadata>) => void;
  debug: (message: string, metadata?: Partial<LogMetadata>) => void;
  trace: (message: string, metadata?: Partial<LogMetadata>) => void;
  
  child: (metadata: Partial<LogMetadata>) => Logger;
  
  startTimer: () => () => number;
  
  flush: () => Promise<void>;
  
  setLevel: (level: LogLevel) => void;
  
  addTransport: (transport: LogTransport) => void;
  removeTransport: (type: LogTransportType) => void;
  
  getStorage: () => LogStorage;
  getAnalyzer: () => LogAnalyzer;
  getMonitor: () => LogMonitor;
} 