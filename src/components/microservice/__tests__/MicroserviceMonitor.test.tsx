import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import MicroserviceMonitor from '../MicroserviceMonitor';
import microserviceReducer from '../../../store/slices/microserviceSlice';

// 테스트용 스토어 생성
const createTestStore = () => {
  return configureStore({
    reducer: {
      microservice: microserviceReducer,
    },
  });
};

// MSW 서버 설정
const server = setupServer(
  rest.get('/api/microservices/configs', (req, res, ctx) => {
    return res(
      ctx.json({
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
      })
    );
  }),
  rest.get('/api/microservices/health/:name', (req, res, ctx) => {
    return res(
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
  rest.get('/api/microservices/metrics/:name', (req, res, ctx) => {
    return res(
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
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MicroserviceMonitor', () => {
  it('renders service cards with correct data', async () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MicroserviceMonitor />
      </Provider>
    );

    // 로딩 상태 확인
    expect(screen.getByText('로딩 중')).toBeInTheDocument();

    // 서비스 카드가 렌더링되는지 확인
    await waitFor(() => {
      expect(screen.getByText('scheduler')).toBeInTheDocument();
    });

    // 서비스 상태 확인
    expect(screen.getByText('healthy')).toBeInTheDocument();

    // 메트릭 값 확인
    expect(screen.getByText('3600s')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const store = createTestStore();

    // API 에러 모킹
    server.use(
      rest.get('/api/microservices/configs', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <MicroserviceMonitor />
      </Provider>
    );

    // 에러 메시지가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch service configs')).toBeInTheDocument();
    });
  });

  it('updates metrics periodically', async () => {
    const store = createTestStore();
    let requestCount = 1000;

    // 메트릭 업데이트 모킹
    server.use(
      rest.get('/api/microservices/metrics/:name', (req, res, ctx) => {
        requestCount += 100;
        return res(
          ctx.json({
            requestCount,
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
      })
    );

    render(
      <Provider store={store}>
        <MicroserviceMonitor />
      </Provider>
    );

    // 초기 메트릭 값 확인
    await waitFor(() => {
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    // 5초 후 업데이트된 메트릭 값 확인
    await waitFor(
      () => {
        expect(screen.getByText('1100')).toBeInTheDocument();
      },
      { timeout: 6000 }
    );
  });
});
