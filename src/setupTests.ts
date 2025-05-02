/// <reference types="@testing-library/jest-dom" />

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';
import 'jest-styled-components';
import { setupTestEnvironment } from './utils/testUtils';
import { server } from './mocks/server';

// Add web API globals
import { Response, Request, Headers, fetch } from 'undici';
Object.assign(global, { Response, Request, Headers, fetch });

// Add TextEncoder and TextDecoder to global
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock i18next
jest.mock('i18next', () => ({
  createInstance: () => ({
    use: () => ({
      init: () => ({}),
    }),
  }),
  use: () => ({
    init: () => ({}),
  }),
}));

// Configure console error and warning handling
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(async () => {
  // Start MSW server
  await server.listen({ onUnhandledRequest: 'warn' });

  console.error = (...args) => {
    if (args[0]?.includes('Warning: An update to')) return;
    if (args[0]?.includes('React does not recognize the')) return;
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (args[0]?.includes('react-i18next::')) return;
    originalWarn.call(console, ...args);
  };
});

afterEach(async () => {
  // Reset MSW handlers
  await server.resetHandlers();
});

afterAll(async () => {
  // Stop MSW server
  await server.close();
  
  console.error = originalError;
  console.warn = originalWarn;
});

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Set test timeout
jest.setTimeout(10000);

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Mock window storage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Setup test environment
beforeEach(() => {
  setupTestEnvironment();
});

// Clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});
