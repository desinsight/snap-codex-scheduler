import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { TaskStatus } from '../types/task';
import { ScheduleCategory } from '../types/schedule';
import * as React from 'react';
export const mockRequest = (options = {}) => {
    return {
        headers: {},
        body: {},
        params: {},
        query: {},
        ...options
    };
};
export const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
export const mockNext = () => {
    return jest.fn();
};
export const createMockUser = (overrides = {}) => {
    return {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date().toISOString(),
        ...overrides
    };
};
export const createMockCacheConfig = (overrides = {}) => {
    return {
        maxSize: 1000,
        maxAge: 3600000,
        updateAgeOnGet: false,
        evictionPolicy: 'lru',
        ...overrides
    };
};
export const waitFor = (ms) => {
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
        trend: 'up',
        change: 5
    },
    latency: {
        average: 100,
        trend: 'down',
        change: -10
    },
    memory: {
        usage: 50,
        trend: 'stable',
        change: 0
    },
    items: {
        count: 500,
        trend: 'up',
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
export const mockTask = {
    id: '1',
    title: 'Test Task',
    status: TaskStatus.PENDING,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
};
export const mockSchedule = {
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
export const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
};
export const createMockStore = (preloadedState) => {
    return configureStore({
        reducer: {
            tasks: (state = { tasks: [], loading: false, error: null }) => state,
            auth: (state = { user: null, loading: false, error: null }) => state,
            schedules: (state = { schedules: [], loading: false, error: null }) => state,
        },
        preloadedState: preloadedState,
    });
};
export const renderWithProviders = (ui, preloadedState) => {
    const store = createMockStore(preloadedState);
    const Wrapper = ({ children }) => (React.createElement(Provider, { store }, children));
    return {
        store,
        ...render(ui, { wrapper: Wrapper }),
    };
};
