import { DatadogConfig } from '../types/config';

export const datadogConfig: DatadogConfig = {
  // Datadog API 설정
  api: {
    apiKey: process.env.DATADOG_API_KEY,
    appKey: process.env.DATADOG_APP_KEY,
    site: 'datadoghq.com'
  },
  
  // 메트릭 설정
  metrics: {
    // 기본 태그
    defaultTags: {
      env: process.env.NODE_ENV,
      service: 'snap-codex-scheduler',
      version: process.env.npm_package_version
    },
    
    // 메트릭 전송 간격 (ms)
    flushInterval: 10000,
    
    // 메트릭 버퍼 크기
    bufferSize: 1000,
    
    // 메트릭 집계 설정
    aggregation: {
      // 평균값 집계
      avg: true,
      // 최대값 집계
      max: true,
      // 최소값 집계
      min: true,
      // 백분위수 집계
      percentiles: [50, 75, 90, 95, 99]
    }
  },
  
  // 트레이스 설정
  tracing: {
    enabled: true,
    // 샘플링 비율
    samplingRate: 1.0,
    // 트레이스 태그
    tags: {
      env: process.env.NODE_ENV,
      service: 'snap-codex-scheduler'
    }
  },
  
  // 로그 설정
  logging: {
    enabled: true,
    // 로그 레벨
    level: 'info',
    // 로그 포맷
    format: 'json',
    // 로그 태그
    tags: {
      env: process.env.NODE_ENV,
      service: 'snap-codex-scheduler'
    }
  },
  
  // 알림 설정
  alerts: {
    // 성능 알림
    performance: {
      // 응답 시간 알림
      responseTime: {
        threshold: 1000, // ms
        window: '5m',
        count: 3
      },
      // 오류율 알림
      errorRate: {
        threshold: 0.05, // 5%
        window: '5m',
        count: 3
      }
    },
    
    // 리소스 알림
    resources: {
      // CPU 사용량 알림
      cpu: {
        threshold: 80, // %
        window: '5m',
        count: 3
      },
      // 메모리 사용량 알림
      memory: {
        threshold: 85, // %
        window: '5m',
        count: 3
      }
    },
    
    // 캐시 알림
    cache: {
      // 캐시 히트율 알림
      hitRate: {
        threshold: 0.8, // 80%
        window: '5m',
        count: 3
      },
      // 캐시 크기 알림
      size: {
        threshold: 0.9, // 90%
        window: '5m',
        count: 3
      }
    }
  },
  
  // 대시보드 설정
  dashboards: {
    // 성능 대시보드
    performance: {
      enabled: true,
      refreshInterval: '1m'
    },
    // 리소스 대시보드
    resources: {
      enabled: true,
      refreshInterval: '1m'
    },
    // 캐시 대시보드
    cache: {
      enabled: true,
      refreshInterval: '1m'
    }
  }
}; 