import { User } from '../types/auth';
import { Task } from '../types/task';
<<<<<<< HEAD
=======
import { AxiosResponse } from 'axios';
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

export const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
<<<<<<< HEAD
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
=======
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
};

export const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'medium',
  dueDate: '2024-12-31',
<<<<<<< HEAD
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
=======
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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
<<<<<<< HEAD
  global.sessionStorage = mockSessionStorage as unknown as Storage;

  jest.mock('./csrf', () => ({
    getCsrfToken: () => mockCsrfToken,
=======
  global.sessionStorage = mockSessionStorage as any;

  jest.mock('./csrf', () => ({
    getCsrfToken: () => mockCsrfToken,
    setCsrfToken: jest.fn(),
    clearCsrfToken: jest.fn(),
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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