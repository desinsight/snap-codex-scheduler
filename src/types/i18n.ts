// 기본 로케일 타입
export type Locale = string; // 'ko-KR' | 'en-US' | 'ja-JP' 등
export type LocaleCode = string; // 'ko' | 'en' | 'ja' 등
export type CountryCode = string; // 'KR' | 'US' | 'JP' 등

// 번역 키 타입
export type TranslationKey = string;

// 번역 값 타입
export type TranslationValue = string | number | boolean | null | undefined | TranslationObject;
export interface TranslationObject {
  [key: string]: TranslationValue;
}

// 번역 네임스페이스 타입
export type Namespace = 'common' | 'auth' | 'schedule' | 'notification' | 'error' | 'settings';

// 번역 리소스 타입
export interface TranslationResources {
  [locale: string]: {
    [namespace: string]: {
      [key: string]: TranslationValue;
    };
  };
}

// 날짜/시간 포맷 타입
export interface DateTimeFormats {
  short: Intl.DateTimeFormatOptions;
  medium: Intl.DateTimeFormatOptions;
  long: Intl.DateTimeFormatOptions;
  relative: Intl.RelativeTimeFormatOptions;
}

// 숫자 포맷 타입
export interface NumberFormats {
  decimal: Intl.NumberFormatOptions;
  percent: Intl.NumberFormatOptions;
  currency: Record<string, Intl.NumberFormatOptions>;
}

// 복수형 규칙 타입
export type PluralRule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export interface PluralRules {
  [key: string]: {
    [rule in PluralRule]?: string;
  };
}

// 국제화 설정 타입
export interface I18nConfig {
  defaultLocale: Locale;
  fallbackLocale: Locale;
  supportedLocales: Locale[];
  loadPath: string;
  interpolation: {
    prefix: string;
    suffix: string;
    escapeValue: boolean;
  };
  detection: {
    order: Array<'querystring' | 'cookie' | 'localStorage' | 'navigator' | 'htmlTag'>;
    lookupQuerystring: string;
    lookupCookie: string;
    lookupLocalStorage: string;
    caches: Array<'localStorage' | 'cookie'>;
  };
  backend: {
    loadPath: string;
    addPath: string;
    allowMultiLoading: boolean;
    crossDomain: boolean;
  };
}

// 국제화 컨텍스트 타입
export interface I18nContext {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationFunction;
  exists: (key: TranslationKey, options?: TranslationOptions) => boolean;
  loadNamespaces: (namespaces: string[]) => Promise<void>;
}

// 번역 함수 타입
export interface TranslationFunction {
  (key: TranslationKey, options?: TranslationOptions): string;
  <T extends object>(key: TranslationKey, options?: TranslationOptions & T): string;
}

// 번역 옵션 타입
export interface TranslationOptions {
  defaultValue?: string;
  count?: number;
  context?: string;
  namespace?: string | string[];
  interpolation?: {
    [key: string]: any;
  };
  formatters?: {
    [key: string]: (value: any, locale: Locale, options?: any) => string;
  };
}

// 메시지 포맷 타입
export interface MessageFormat {
  compile: (message: string, locale: Locale) => (values: Record<string, any>) => string;
  format: (message: string, values: Record<string, any>, locale: Locale) => string;
}

// 로케일 데이터 타입
export interface LocaleData {
  code: LocaleCode;
  country: CountryCode;
  name: {
    native: string;
    english: string;
  };
  direction: 'ltr' | 'rtl';
  calendar: {
    firstDay: number;
    formats: DateTimeFormats;
    months: {
      long: string[];
      short: string[];
    };
    days: {
      long: string[];
      short: string[];
    };
  };
  numbers: {
    decimal: string;
    group: string;
    formats: NumberFormats;
  };
  currencies: {
    [code: string]: {
      symbol: string;
      name: string;
      symbolPosition: 'before' | 'after';
    };
  };
}

// 국제화 상태 타입
export interface I18nState {
  locale: Locale;
  messages: TranslationResources;
  namespaces: string[];
  initialized: boolean;
  loading: boolean;
  error: Error | null;
}

// 국제화 이벤트 타입
export type I18nEventType = 
  | 'loaded'
  | 'added'
  | 'removed'
  | 'languageChanged'
  | 'initialized'
  | 'failedLoading'
  | 'missingKey';

export interface I18nEvent {
  type: I18nEventType;
  payload?: any;
  timestamp: number;
}

// 국제화 플러그인 타입
export interface I18nPlugin {
  name: string;
  version: string;
  init: (context: I18nContext) => void;
  type: 'postProcessor' | 'formatter' | 'loader' | 'logger';
}

// 국제화 캐시 타입
export interface I18nCache {
  get: (locale: Locale, namespace: string) => TranslationObject | null;
  set: (locale: Locale, namespace: string, data: TranslationObject) => void;
  remove: (locale: Locale, namespace?: string) => void;
  clear: () => void;
}

// 국제화 로더 타입
export interface I18nLoader {
  type: 'backend' | 'filesystem' | 'bundled';
  read: (locale: Locale, namespace: string) => Promise<TranslationObject>;
  write?: (locale: Locale, namespace: string, data: TranslationObject) => Promise<void>;
}

// 국제화 포맷터 타입
export interface I18nFormatters {
  number: (value: number, locale: Locale, options?: Intl.NumberFormatOptions) => string;
  currency: (value: number, locale: Locale, currency: string, options?: Intl.NumberFormatOptions) => string;
  datetime: (value: Date | number, locale: Locale, options?: Intl.DateTimeFormatOptions) => string;
  relative: (value: Date | number, locale: Locale, options?: Intl.RelativeTimeFormatOptions) => string;
}

// 국제화 유효성 검사 타입
export interface I18nValidation {
  validateLocale: (locale: Locale) => boolean;
  validateNamespace: (namespace: string) => boolean;
  validateTranslation: (translation: TranslationObject) => boolean;
  validateKey: (key: TranslationKey) => boolean;
}

// 국제화 미들웨어 타입
export interface I18nMiddleware {
  before?: (locale: Locale, key: TranslationKey, options: TranslationOptions) => void;
  after?: (locale: Locale, key: TranslationKey, translated: string) => string;
  error?: (locale: Locale, key: TranslationKey, error: Error) => void;
} 