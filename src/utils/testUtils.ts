import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user';
import { CacheConfig } from '../types/cache';

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
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  flushdb: jest.fn(),
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