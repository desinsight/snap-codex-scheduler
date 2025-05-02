import { ReactNode } from 'react';
import { Schedule } from './schedule';
import { User } from './auth';
import { Notification } from './notification';

// 타입 유틸리티
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type ValueOf<T> = T[keyof T];

export type PickRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OmitStrict<T, K extends keyof T> = Omit<T, K>;

// 함수 유틸리티
export type AsyncFunction<T = any, Args extends any[] = any[]> = (...args: Args) => Promise<T>;

export type EventHandler<T = any> = (event: T) => void | Promise<void>;

export type Callback<T = void> = () => T | Promise<T>;

export type Predicate<T> = (value: T) => boolean;

export type Comparator<T> = (a: T, b: T) => number;

// 날짜/시간 유틸리티
export type DateRange = {
  start: Date;
  end: Date;
};

export type TimeRange = {
  start: string; // HH:mm
  end: string; // HH:mm
};

export type DateTimeRange = {
  start: Date;
  end: Date;
  timezone: string;
};

// 검색/필터링 유틸리티
export type SearchOptions<T> = {
  query: string;
  fields: (keyof T)[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
};

export type FilterOptions<T> = {
  [K in keyof T]?: T[K] | T[K][];
};

export type SortOptions<T> = {
  field: keyof T;
  direction: 'asc' | 'desc';
}[];

// 페이지네이션 유틸리티
export type PaginationOptions = {
  page: number;
  pageSize: number;
  total: number;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationOptions;
};

// 폼 유틸리티
export type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
};

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
} & {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
};

// API 유틸리티
export type QueryParams = Record<string, string | number | boolean | undefined>;

export type RequestOptions = {
  headers?: Record<string, string>;
  params?: QueryParams;
  timeout?: number;
  retry?: number;
};

export type ResponseMetadata = {
  status: number;
  headers: Record<string, string>;
  timestamp: string;
};

// UI 유틸리티
export type Theme = 'light' | 'dark' | 'system';

export type Size = 'small' | 'medium' | 'large';

export type Position = 'top' | 'right' | 'bottom' | 'left';

export type Alignment = 'start' | 'center' | 'end';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 애니메이션 유틸리티
export type AnimationConfig = {
  duration: number;
  delay?: number;
  easing?: string;
  repeat?: number;
  direction?: 'normal' | 'reverse' | 'alternate';
};

export type TransitionConfig = {
  property: string;
  duration: number;
  timing?: string;
  delay?: number;
};

// 접근성 유틸리티
export type AriaProps = {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  'aria-selected'?: boolean;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-checked'?: boolean;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-readonly'?: boolean;
  'aria-multiline'?: boolean;
  'aria-placeholder'?: string;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
};

// 국제화 유틸리티
export type Locale = 'en' | 'ko' | 'ja' | 'zh';

export type TranslationKey = string;

export type TranslationOptions = {
  locale: Locale;
  fallbackLocale: Locale;
  namespace?: string;
};

// 성능 유틸리티
export type PerformanceMetric = {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
};

export type PerformanceReport = {
  metrics: PerformanceMetric[];
  startTime: string;
  endTime: string;
  environment: string;
};

// 보안 유틸리티
export type SecurityLevel = 'low' | 'medium' | 'high' | 'critical';

export type SecurityPolicy = {
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAgeDays: number;
    historySize: number;
  };
  session: {
    timeout: number;
    maxConcurrentSessions: number;
  };
  twoFactor: {
    required: boolean;
    methods: ('email' | 'sms' | 'authenticator')[];
  };
};

// 로깅 유틸리티
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
};

export type LoggerConfig = {
  level: LogLevel;
  format: 'json' | 'text';
  destination: 'console' | 'file' | 'remote';
  maxSize?: number;
  maxFiles?: number;
}; 