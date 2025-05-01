import { User } from '../types/auth';
import { Task } from '../types/task';
import { AxiosResponse } from 'axios';

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'medium',
  dueDate: '2024-12-31',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  userId: '1',
};

export const mockAuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: mockUser,
};

export const mockErrorResponse = {
  status: 400,
  message: 'Bad Request',
  errors: ['Invalid input'],
};

export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

export const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

export const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
};

export const mockCsrfToken = 'mock-csrf-token';

export const setupTestEnvironment = () => {
  global.localStorage = mockLocalStorage as unknown as Storage;
  global.sessionStorage = mockSessionStorage as any;

  jest.mock('./csrf', () => ({
    getCsrfToken: () => mockCsrfToken,
    setCsrfToken: jest.fn(),
    clearCsrfToken: jest.fn(),
  }));

  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
};

export const cleanupTestEnvironment = () => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.resetAllMocks();
}; 