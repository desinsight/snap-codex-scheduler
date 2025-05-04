import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user';
import { CacheConfig } from '../types/cache';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { RootState } from '../store';
import { Task, TaskStatus } from '../types/task';
import { Schedule, ScheduleCategory } from '../types/schedule';
import { User as AuthUser } from '../types/auth';
import * as React from 'react';
import userEvent from '@testing-library/user-event';

export const mockRequest = (options: Partial<Request> = {}): Request => {
  return {
    headers: {},
    body: {},
    params: {},
    query: {},
    ...options
  } as Request;
};

export const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = (): NextFunction => {
  return jest.fn();
};

export const createMockUser = (overrides: Partial<User> = {}): User => {
  return {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
    ...overrides
  };
};

export const createMockCacheConfig = (overrides: Partial<CacheConfig> = {}): CacheConfig => {
  return {
    maxSize: 1000,
    maxAge: 3600000,
    updateAgeOnGet: false,
    evictionPolicy: 'lru',
    ...overrides
  };
};

export const waitFor = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const mockRedisClient = {
  get: () => Promise.resolve(null),
  set: () => Promise.resolve('OK'),
  del: () => Promise.resolve(1),
  flushdb: () => Promise.resolve('OK'),
  dbsize: jest.fn(),
  expire: jest.fn(),
  ping: jest.fn(),
  quit: jest.fn()
};

export const mockCacheMetrics = {
  hitRate: {
    rate: 0.8,
    trend: 'up' as const,
    change: 5
  },
  latency: {
    average: 100,
    trend: 'down' as const,
    change: -10
  },
  memory: {
    usage: 50,
    trend: 'stable' as const,
    change: 0
  },
  items: {
    count: 500,
    trend: 'up' as const,
    change: 2
  },
  timestamp: new Date().toISOString()
};

export const mockCacheStats = {
  hits: 100,
  misses: 25,
  evictions: 10,
  size: 500,
  maxSize: 1000,
  hitRate: 0.8
};

export const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  status: TaskStatus.PENDING,
  notes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockSchedule: Schedule = {
  id: '1',
  title: 'Test Schedule',
  description: 'Test Description',
  startDate: new Date(),
  endDate: new Date(),
  category: ScheduleCategory.WORK,
  createdBy: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
  isShared: false,
  priority: 'medium',
  status: 'pending',
  isAllDay: false,
};

export const mockUser: AuthUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      tasks: (state = { tasks: [], loading: false, error: null }) => state,
      auth: (state = { user: null, loading: false, error: null }) => state,
      schedules: (state = { schedules: [], loading: false, error: null }) => state,
    },
    preloadedState: preloadedState as any,
  });
};

export const renderWithProviders = (ui: React.ReactElement) => {
  return {
    user: userEvent.setup(),
    ...render(ui),
  };
};

export const waitForLoadingToFinish = async () => {
  await waitFor(
    () => {
      const loadingElements = screen.queryAllByText(/loading/i);
      return loadingElements.length === 0;
    },
    { timeout: 5000 }
  );
};

export const expectToBeInTheDocument = (text: string) => {
  expect(screen.getByText(text)).toBeInTheDocument();
};

export const expectNotToBeInTheDocument = (text: string) => {
  expect(screen.queryByText(text)).not.toBeInTheDocument();
}; 