import { Schedule } from './schedule';
import { User } from './auth';
import { Notification } from './notification';
import { ServiceHealth } from './microservice';

// HTTP 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API 요청 기본 타입
export interface ApiRequest<T = any> {
  method: HttpMethod;
  url: string;
  data?: T;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheKey?: string;
  cacheExpiry?: number;
}

// API 응답 기본 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  metadata?: {
    status: number;
    headers: Record<string, string>;
    requestId: string;
    duration: number;
  };
}

// API 에러 타입
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string;
  };
  timestamp: string;
  metadata?: {
    status: number;
    headers: Record<string, string>;
    requestId: string;
    duration: number;
  };
}

// API 클라이언트 설정 타입
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  auth?: {
    type: 'bearer' | 'basic' | 'apiKey';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
  };
  retry?: {
    attempts: number;
    delay: number;
    onRetry?: (error: ApiError, attempt: number) => void;
  };
  cache?: {
    enabled: boolean;
    defaultExpiry: number;
  };
  interceptors?: {
    request?: (config: ApiRequest) => ApiRequest | Promise<ApiRequest>;
    response?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
    error?: (error: ApiError) => ApiError | Promise<ApiError>;
  };
}

// API 엔드포인트 타입
export interface ApiEndpoint<T = any, R = any> {
  path: string;
  method: HttpMethod;
  requestType?: T;
  responseType?: R;
  description?: string;
  requiresAuth?: boolean;
  rateLimit?: {
    requests: number;
    interval: number; // in seconds
  };
}

// API 요청/응답 유틸리티 타입
export type RequestParams<T = any> = Omit<ApiRequest<T>, 'method' | 'url'>;
export type ResponseData<T = any> = T extends ApiResponse<infer R> ? R : never;
export type ErrorData = ApiError['error'];

// API 요청 빌더 타입
export interface ApiRequestBuilder<T = any> {
  withData: (data: T) => ApiRequestBuilder<T>;
  withParams: (params: Record<string, string | number | boolean | undefined>) => ApiRequestBuilder<T>;
  withHeaders: (headers: Record<string, string>) => ApiRequestBuilder<T>;
  withTimeout: (timeout: number) => ApiRequestBuilder<T>;
  withRetry: (retry: number, delay?: number) => ApiRequestBuilder<T>;
  withCache: (key: string, expiry?: number) => ApiRequestBuilder<T>;
  build: () => ApiRequest<T>;
}

// API 응답 변환기 타입
export interface ApiResponseTransformer<T = any, R = any> {
  transform: (response: ApiResponse<T>) => ApiResponse<R>;
  transformError: (error: ApiError) => ApiError;
}

// API 캐시 관리자 타입
export interface ApiCacheManager {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T, expiry?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

// API 요청 인터셉터 체인 타입
export interface ApiInterceptorChain {
  request: (config: ApiRequest) => Promise<ApiRequest>;
  response: (response: ApiResponse) => Promise<ApiResponse>;
  error: (error: ApiError) => Promise<ApiError>;
}

// API 요청/응답 로거 타입
export interface ApiLogger {
  logRequest: (request: ApiRequest) => void;
  logResponse: (response: ApiResponse) => void;
  logError: (error: ApiError) => void;
}

// API 모니터링 타입
export interface ApiMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageLatency: number;
  errorRate: number;
  statusCodes: Record<number, number>;
  endpoints: Record<string, {
    requestCount: number;
    successCount: number;
    errorCount: number;
    averageLatency: number;
  }>;
}

// API 요청/응답 유효성 검사기 타입
export interface ApiValidator<T = any> {
  validateRequest: (request: ApiRequest<T>) => Promise<boolean>;
  validateResponse: (response: ApiResponse) => Promise<boolean>;
}

// API 요청/응답 직렬화기 타입
export interface ApiSerializer {
  serialize: (data: any) => string;
  deserialize: (data: string) => any;
}

// API 요청/응답 압축기 타입
export interface ApiCompressor {
  compress: (data: any) => Promise<Uint8Array>;
  decompress: (data: Uint8Array) => Promise<any>;
}

// API 요청/응답 암호화기 타입
export interface ApiEncryptor {
  encrypt: (data: any) => Promise<string>;
  decrypt: (data: string) => Promise<any>;
}

// API 요청/응답 인증기 타입
export interface ApiAuthenticator {
  authenticate: (request: ApiRequest) => Promise<ApiRequest>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

// API 요청/응답 재시도 관리자 타입
export interface ApiRetryManager {
  shouldRetry: (error: ApiError, attempt: number) => boolean;
  getDelay: (attempt: number) => number;
  onRetry: (error: ApiError, attempt: number) => void;
}

// 페이지네이션된 응답을 위한 타입
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 스케줄 관련 API 응답 타입
export interface ScheduleResponse extends ApiResponse<Schedule> {}
export interface ScheduleListResponse extends ApiResponse<PaginatedResponse<Schedule>> {}
export interface ScheduleBulkResponse extends ApiResponse<{
  successful: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
}> {}

// 사용자 관련 API 응답 타입
export interface UserResponse extends ApiResponse<User> {}
export interface UserListResponse extends ApiResponse<PaginatedResponse<User>> {}
export interface UserAuthResponse extends ApiResponse<{
  user: User;
  token: string;
  refreshToken: string;
}> {}

// 알림 관련 API 응답 타입
export interface NotificationResponse extends ApiResponse<Notification> {}
export interface NotificationListResponse extends ApiResponse<PaginatedResponse<Notification>> {}
export interface NotificationBulkResponse extends ApiResponse<{
  sent: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}> {}

// 시스템 상태 관련 API 응답 타입
export interface SystemStatusResponse extends ApiResponse<{
  version: string;
  environment: string;
  services: Record<string, ServiceHealth>;
  lastUpdate: string;
}> {}

// 통계 및 분석 관련 API 응답 타입
export interface AnalyticsResponse extends ApiResponse<{
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalSchedules: number;
    completedSchedules: number;
    activeUsers: number;
    notificationDeliveryRate: number;
  };
  trends: Array<{
    date: string;
    scheduleCount: number;
    userCount: number;
  }>;
}> {}

// 설정 관련 API 응답 타입
export interface SettingsResponse extends ApiResponse<{
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'system';
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
}> {} 