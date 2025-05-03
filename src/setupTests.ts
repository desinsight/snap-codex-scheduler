/// <reference types="@testing-library/jest-dom" />

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import 'jest-styled-components';
import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';
import { ReadableStream, TransformStream } from 'stream/web';
import { server } from './mocks/server';

// Mock Web APIs
class MessageChannel {
  port1: any;
  port2: any;
  constructor() {
    this.port1 = {};
    this.port2 = {};
  }
}

class MessagePort {
  postMessage() {}
  start() {}
  close() {}
}

Object.defineProperties(global, {
  TextEncoder: { value: TextEncoder },
  TextDecoder: { value: TextDecoder },
  crypto: { value: webcrypto },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  MessageChannel: { value: MessageChannel },
  MessagePort: { value: MessagePort },
});

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Mock Vite environment variables
Object.defineProperty(window, '__VITE_ENV__', {
  value: {
    VITE_API_URL: 'http://localhost:3000',
    VITE_APP_NAME: 'Snap Codex Scheduler',
    VITE_APP_VERSION: '1.0.0',
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
  clear: () => null,
  length: 0,
  key: () => null,
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null,
  clear: () => null,
  length: 0,
  key: () => null,
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: number[] = [0];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
global.IntersectionObserver = MockIntersectionObserver;

// Mock fetch
global.fetch = () => Promise.resolve(new Response());

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: () => Promise.resolve(),
    readText: () => Promise.resolve(''),
  },
});

// Mock navigator.geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: () => {},
    watchPosition: () => {},
    clearWatch: () => {},
  },
});

// Mock navigator.permissions
Object.defineProperty(navigator, 'permissions', {
  value: {
    query: () => Promise.resolve({ state: 'granted' }),
  },
});

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: () => Promise.resolve(new MediaStream()),
    enumerateDevices: () => Promise.resolve([]),
  },
});

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  value: {
    requestPermission: () => Promise.resolve('granted'),
    permission: 'granted',
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = () => {};

// Mock performance.now
global.performance.now = () => 0;

// Mock Date
const mockDate = new Date('2024-01-01T00:00:00.000Z');
const OriginalDate = global.Date;
global.Date = class extends OriginalDate {
  constructor() {
    super();
    return mockDate;
  }
  static now() {
    return mockDate.getTime();
  }
} as DateConstructor;

// Mock Math.random
global.Math.random = () => 0.5;

// Mock console methods
global.console = {
  ...console,
  error: () => {},
  warn: () => {},
  info: () => {},
  debug: () => {},
  log: () => {},
};

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
