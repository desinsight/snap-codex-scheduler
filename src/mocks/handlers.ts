import { rest } from 'msw';

const API_URL = process.env.VITE_API_URL || 'https://api.example.com';

export const handlers = [
  // Auth
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
        },
      })
    );
  }),

  // Tasks
  rest.get(`${API_URL}/tasks`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          dueDate: '2024-05-01',
        },
      ])
    );
  }),

  // Notifications
  rest.get(`${API_URL}/notifications`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          type: 'info',
          message: 'Test Notification',
          read: false,
          createdAt: '2024-05-01T00:00:00Z',
        },
      ])
    );
  }),

  // Error handling
  rest.get('*', (req, res, ctx) => {
    console.error(`Unhandled request: ${req.url.toString()}`);
    return res(ctx.status(500));
  }),
]; 