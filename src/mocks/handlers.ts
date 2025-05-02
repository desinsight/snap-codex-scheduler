import { rest } from 'msw';
import { API_URL } from '../config';

export const handlers = [
  // Auth handlers
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    );
  }),

  rest.post(`${API_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '2',
          email: 'new@example.com',
          name: 'New User',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    );
  }),

  // Schedule handlers
  rest.get(`${API_URL}/schedules`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          title: 'Test Schedule',
          description: 'Test Description',
          startTime: new Date(),
          endTime: new Date(),
          category: 'work',
          createdBy: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
    );
  }),

  // Microservice handlers
  rest.get(`${API_URL}/microservices/configs`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        services: {
          scheduler: {
            name: 'scheduler',
            version: '1.0.0',
            port: 3000,
            healthCheck: {
              path: '/health',
              interval: 30,
            },
            dependencies: [],
            environment: {},
          },
        },
      })
    );
  }),

  rest.get(`${API_URL}/microservices/health/:name`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'healthy',
        uptime: 3600,
        memoryUsage: 45,
        cpuUsage: 30,
        lastCheck: new Date().toISOString(),
        errors: [],
      })
    );
  }),

  rest.get(`${API_URL}/microservices/metrics/:name`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        requestCount: 1000,
        errorCount: 5,
        averageLatency: 150,
        activeConnections: 50,
        resourceUsage: {
          memory: 45,
          cpu: 30,
          disk: 25,
        },
      })
    );
  }),

  // Notification handlers
  rest.get(`${API_URL}/notifications`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'info',
          read: false,
          createdAt: new Date(),
        },
      ])
    );
  }),

  rest.post(`${API_URL}/notifications/read/:id`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
      })
    );
  }),

  // User preferences handlers
  rest.get(`${API_URL}/user-preferences`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        theme: 'light',
        language: 'ko',
      })
    );
  }),

  // Error handler - 항상 마지막에 위치
  rest.all('*', (req, res, ctx) => {
    console.error(`Unhandled request: ${req.method} ${req.url}`);
    return res(
      ctx.status(500),
      ctx.json({ error: 'Unhandled request' })
    );
  }),
]; 