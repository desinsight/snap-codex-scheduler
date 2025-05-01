<<<<<<< HEAD
/// <reference types="@testing-library/jest-dom" />

=======
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';
<<<<<<< HEAD
import 'jest-styled-components';
import { setupTestEnvironment } from './utils/testUtils';

// Add TextEncoder and TextDecoder to global
=======
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'jest-styled-components';
import { setupTestEnvironment } from './utils/testUtils';

>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

<<<<<<< HEAD
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

=======
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
// 테스트 환경에서 console.error와 console.warn을 무시하도록 설정
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes('Warning: An update to')) {
      return;
    }
    if (args[0]?.includes('React does not recognize the')) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (args[0]?.includes('react-i18next::')) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// 테스트 라이브러리 설정
configure({
  testIdAttribute: 'data-testid',
});

<<<<<<< HEAD
=======
// i18next 초기화
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: {
        translation: {
          auth: {
            login: {
              title: '로그인',
              email: '이메일',
              password: '비밀번호',
              rememberMe: '자동 로그인',
              submit: '로그인',
              forgotPassword: '비밀번호를 잊으셨나요?',
              signUp: '회원가입',
            },
          },
          loading: {
            title: '로딩 중',
            spinner: '로딩 스피너',
            defaultMessage: '로딩 중...',
          },
        },
      },
      en: {
        translation: {
          auth: {
            login: {
              title: 'Login',
              email: 'Email',
              password: 'Password',
              rememberMe: 'Remember me',
              submit: 'Login',
              forgotPassword: 'Forgot password?',
              signUp: 'Sign up',
            },
          },
          loading: {
            title: 'Loading',
            spinner: 'Loading spinner',
            defaultMessage: 'Loading...',
          },
        },
      },
    },
    lng: 'ko',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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

// Mock window object
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
<<<<<<< HEAD
=======

export default i18n;
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
