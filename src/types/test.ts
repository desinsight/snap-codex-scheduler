import { ReactElement } from 'react';
import { RenderResult } from '@testing-library/react';
import { Store } from 'redux';
import { Theme } from './styles';
import { User } from './auth';
import { Schedule } from './schedule';
import { Notification } from './notification';
import { MemoryHistory } from 'history';
import { AxiosInstance } from 'axios';
import { RootState } from './state';

// 테스트 렌더링 옵션 타입
export interface TestRenderOptions {
  initialRoute?: string;
  store?: Store;
  theme?: Theme;
  user?: User;
  mockApi?: boolean;
  mockDate?: Date;
  mockLocalStorage?: Record<string, string>;
  mockSessionStorage?: Record<string, string>;
}

// 테스트 래퍼 프롭스 타입
export interface TestWrapperProps {
  children: ReactElement;
  options?: TestRenderOptions;
}

// 테스트 렌더링 결과 타입
export interface TestRenderResult extends RenderResult {
  store?: Store;
  history?: {
    push: (path: string) => void;
    replace: (path: string) => void;
    goBack: () => void;
  };
  mockApi?: {
    reset: () => void;
    restore: () => void;
  };
}

// 모의 사용자 이벤트 타입
export interface MockUserEvent {
  type: 'click' | 'change' | 'submit' | 'keyPress' | 'focus' | 'blur';
  target: string | RegExp;
  value?: string | boolean | number;
  options?: {
    bubbles?: boolean;
    cancelable?: boolean;
    key?: string;
    code?: string;
    keyCode?: number;
  };
}

// 모의 API 응답 타입
export interface MockApiResponse<T = any> {
  status: number;
  data: T;
  headers?: Record<string, string>;
  delay?: number;
}

// 모의 API 요청 매처 타입
export interface MockApiMatcher {
  url: string | RegExp;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
}

// 모의 API 설정 타입
export interface MockApiConfig {
  baseURL?: string;
  defaultDelay?: number;
  defaultHeaders?: Record<string, string>;
  defaultStatus?: number;
  onRequest?: (request: any) => void;
  onResponse?: (response: any) => void;
  onError?: (error: any) => void;
}

// 테스트 데이터 생성기 타입
export interface TestDataGenerator<T> {
  one: (overrides?: Partial<T>) => T;
  many: (count: number, overrides?: Partial<T>) => T[];
  random: () => T;
}

// 테스트 데이터 팩토리 타입
export interface TestDataFactory {
  user: TestDataGenerator<User>;
  schedule: TestDataGenerator<Schedule>;
  notification: TestDataGenerator<Notification>;
}

// 테스트 스냅샷 옵션 타입
export interface TestSnapshotOptions {
  mode?: 'minimal' | 'full';
  ignoreProps?: string[];
  transformers?: Array<(data: any) => any>;
}

// 테스트 성능 메트릭 타입
export interface TestPerformanceMetrics {
  renderTime: number;
  hydrationTime: number;
  interactionTime: number;
  memoryUsage: number;
}

// 테스트 케이스 메타데이터 타입
export interface TestCaseMetadata {
  title: string;
  description?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  type?: 'unit' | 'integration' | 'e2e';
  owner?: string;
  dependencies?: string[];
}

// 테스트 모의 타이머 타입
export interface MockTimer {
  now: number;
  advance: (ms: number) => void;
  runAllTimers: () => void;
  runOnlyPendingTimers: () => void;
  clearAllTimers: () => void;
}

// 테스트 모의 로케이션 타입
export interface MockLocation {
  pathname: string;
  search: string;
  hash: string;
  state: any;
  key: string;
}

// 테스트 모의 네트워크 타입
export interface MockNetwork {
  online: boolean;
  speed: 'slow' | 'medium' | 'fast';
  latency: number;
}

// 테스트 어설션 헬퍼 타입
export interface TestAssertions {
  toBeInTheDocument: () => boolean;
  toBeVisible: () => boolean;
  toBeEnabled: () => boolean;
  toHaveValue: (value: any) => boolean;
  toHaveStyle: (style: Partial<CSSStyleDeclaration>) => boolean;
  toHaveBeenCalledWith: (...args: any[]) => boolean;
  toMatchSnapshot: (options?: TestSnapshotOptions) => boolean;
}

// 테스트 유틸리티 함수 타입
export interface TestUtils {
  // Setup & Teardown
  setup: (config?: Partial<TestConfig>) => Promise<TestContext>;
  cleanup: () => Promise<void>;
  resetState: () => Promise<void>;
  
  // Mock Data
  mock: MockGenerators;
  mockApi: MockApi;
  
  // Event Simulation
  events: EventSimulator;
  
  // Assertions
  expect: jest.Expect & CustomMatchers;
  
  // Utilities
  wait: (ms: number) => Promise<void>;
  act: (callback: () => Promise<void> | void) => Promise<void>;
  
  // Snapshot
  snapshot: {
    take: (name: string) => void;
    verify: (name: string) => boolean;
    update: (name: string) => void;
  };
  
  // Reporting
  report: {
    generate: () => Promise<TestReport>;
    export: (format: 'html' | 'json' | 'junit') => Promise<string>;
  };

  // Rendering Utilities
  render: (ui: ReactElement, options?: TestRenderOptions) => TestRenderResult;
  renderHook: <Result, Props>(callback: (props: Props) => Result, options?: TestRenderOptions) => {
    result: { current: Result };
    rerender: (props?: Props) => void;
    unmount: () => void;
  };

  // Event Utilities
  fireEvent: (element: Element | null, event: MockUserEvent) => void;
  waitFor: (callback: () => void | Promise<void>, options?: { timeout?: number; interval?: number }) => Promise<void>;
}

// 테스트 설정 타입
export interface TestConfig {
  environment: 'unit' | 'integration' | 'e2e';
  mockMode: 'strict' | 'loose';
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  timeouts: {
    test: number;
    hook: number;
    assertion: number;
  };
  retries: number;
}

// Test Context Types
export interface TestContext {
  store: Store<RootState>;
  history: MemoryHistory;
  api: AxiosInstance;
  rendered: RenderResult;
  cleanup: () => void;
}

// Mock Data Generator Types
export interface MockDataConfig {
  count?: number;
  seed?: string;
  locale?: string;
  overrides?: Record<string, any>;
}

export interface MockGenerators {
  user: (config?: MockDataConfig) => User;
  schedule: (config?: MockDataConfig) => Schedule;
  notification: (config?: MockDataConfig) => Notification;
  state: (config?: MockDataConfig) => Partial<RootState>;
}

// Test Event Simulation Types
export interface TestEvent {
  type: string;
  target: string;
  data?: any;
  delay?: number;
}

export interface EventSimulator {
  click: (selector: string, options?: any) => Promise<void>;
  type: (selector: string, text: string, options?: any) => Promise<void>;
  submit: (selector: string, data?: any) => Promise<void>;
  drag: (source: string, target: string) => Promise<void>;
  hover: (selector: string, duration?: number) => Promise<void>;
  scroll: (selector: string, position: { x: number; y: number }) => Promise<void>;
  keyPress: (key: string, options?: any) => Promise<void>;
  resize: (dimensions: { width: number; height: number }) => Promise<void>;
}

// Test Assertion Types
export interface AssertionResult {
  passed: boolean;
  message?: string;
  expected: any;
  received: any;
  diff?: string;
}

export interface CustomMatchers {
  toBeValidSchedule(): AssertionResult;
  toHaveValidDateRange(): AssertionResult;
  toBeAuthenticatedUser(): AssertionResult;
  toHaveValidNotification(): AssertionResult;
  toMatchSnapshot(name?: string): AssertionResult;
  toHaveBeenCalledWithMatch(expected: any): AssertionResult;
}

// Mock API Types
export interface MockEndpoint {
  path: string;
  method: string;
  response: any;
  config?: MockApiConfig;
}

export interface MockApi {
  setup: (endpoints: MockEndpoint[]) => void;
  reset: () => void;
  getCallHistory: () => Array<{
    path: string;
    method: string;
    data?: any;
    timestamp: number;
  }>;
}

// Test Reporter Types
export interface TestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  suites: Array<{
    name: string;
    tests: Array<{
      name: string;
      status: 'passed' | 'failed' | 'skipped';
      duration: number;
      error?: {
        message: string;
        stack?: string;
      };
    }>;
  }>;
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
    files: Record<string, {
      statements: number;
      branches: number;
      functions: number;
      lines: number;
    }>;
  };
}

// Test Suite Configuration
export interface TestSuiteConfig {
  name: string;
  description?: string;
  timeout?: number;
  retries?: number;
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
  beforeEach?: () => Promise<void>;
  afterEach?: () => Promise<void>;
}

// Test Case Configuration
export interface TestCaseConfig {
  name: string;
  description?: string;
  timeout?: number;
  retries?: number;
  only?: boolean;
  skip?: boolean;
  tags?: string[];
}

// Component Test Wrapper Types
export interface TestWrapper {
  withRouter: (options?: { initialEntries?: string[] }) => React.FC;
  withStore: (initialState?: Partial<RootState>) => React.FC;
  withTheme: (theme?: 'light' | 'dark') => React.FC;
  withI18n: (locale?: string) => React.FC;
  withAuth: (user?: User) => React.FC;
  withAll: (options?: {
    router?: { initialEntries?: string[] };
    store?: Partial<RootState>;
    theme?: 'light' | 'dark';
    locale?: string;
    user?: User;
  }) => React.FC;
}

// Performance Test Types
export interface PerformanceMetrics {
  renderTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    network: {
      requests: number;
      size: number;
    };
  };
}

export interface PerformanceTest {
  measure: (component: React.ComponentType, props?: any) => Promise<PerformanceMetrics>;
  benchmark: (iterations: number) => Promise<{
    average: PerformanceMetrics;
    min: PerformanceMetrics;
    max: PerformanceMetrics;
  }>;
}

// Integration Test Types
export interface IntegrationTest {
  api: {
    mock: MockApi;
    real: AxiosInstance;
  };
  database: {
    setup: () => Promise<void>;
    teardown: () => Promise<void>;
    seed: (data: any) => Promise<void>;
  };
  browser: {
    launch: () => Promise<void>;
    close: () => Promise<void>;
    navigate: (url: string) => Promise<void>;
    screenshot: (name: string) => Promise<void>;
  };
} 