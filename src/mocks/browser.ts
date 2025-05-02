import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// 개발 환경에서만 Mock 서버 실행
if (process.env.NODE_ENV === 'development') {
  worker.start();
} 