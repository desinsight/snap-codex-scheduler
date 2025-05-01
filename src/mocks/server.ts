import { setupServer } from 'msw/node';
import { rest } from 'msw';

const handlers = [
  // 서비스 설정
  rest.get('/api/microservices/configs', (req, res, ctx) => {
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

  // 서비스 상태
  rest.get('/api/microservices/health/:name', (req, res, ctx) => {
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

  // 서비스 메트릭
  rest.get('/api/microservices/metrics/:name', (req, res, ctx) => {
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

  // 서킷 브레이커 설정
  rest.put('/api/microservices/circuit-breakers/:name', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: req.params.name,
        config: {
          failureThreshold: 5,
          successThreshold: 2,
          timeout: 5000,
          resetTimeout: 30000,
        },
      })
    );
  }),
];

export const server = setupServer(...handlers);
