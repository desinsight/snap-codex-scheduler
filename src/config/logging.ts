import { LoggingConfig } from '../types/config';

export const loggingConfig: LoggingConfig = {
  // 로그 레벨
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  
  // 로그 포맷
  format: 'json',
  
  // 로그 출력
  outputs: {
    // 콘솔 출력
    console: {
      enabled: true,
      level: 'debug'
    },
    
    // 파일 출력
    file: {
      enabled: true,
      level: 'info',
      path: 'logs/app.log',
      maxSize: 10485760, // 10MB
      maxFiles: 10,
      compress: true
    },
    
    // Elasticsearch 출력
    elasticsearch: {
      enabled: true,
      level: 'info',
      node: process.env.ELASTICSEARCH_URL,
      index: 'snap-codex-scheduler-logs',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD
      }
    },
    
    // Datadog 출력
    datadog: {
      enabled: true,
      level: 'info',
      apiKey: process.env.DATADOG_API_KEY
    }
  },
  
  // 로그 필터링
  filters: {
    // 민감 정보 필터링
    sensitiveData: {
      enabled: true,
      patterns: [
        'password',
        'token',
        'apiKey',
        'secret'
      ]
    },
    
    // 로그 레벨 필터링
    level: {
      enabled: true,
      levels: ['error', 'warn', 'info']
    }
  },
  
  // 로그 컨텍스트
  context: {
    // 기본 컨텍스트
    default: {
      env: process.env.NODE_ENV,
      service: 'snap-codex-scheduler',
      version: process.env.npm_package_version
    },
    
    // 요청 컨텍스트
    request: {
      enabled: true,
      fields: [
        'method',
        'url',
        'status',
        'responseTime',
        'userAgent',
        'ip'
      ]
    },
    
    // 사용자 컨텍스트
    user: {
      enabled: true,
      fields: [
        'id',
        'role',
        'organization'
      ]
    }
  },
  
  // 로그 로테이션
  rotation: {
    // 파일 크기 기반 로테이션
    size: {
      enabled: true,
      maxSize: 10485760, // 10MB
      maxFiles: 10
    },
    
    // 시간 기반 로테이션
    time: {
      enabled: true,
      interval: '1d',
      maxFiles: 30
    }
  },
  
  // 로그 보관
  retention: {
    // 로그 보관 기간
    period: '30d',
    
    // 보관 정책
    policy: {
      // 오류 로그
      error: {
        period: '90d',
        compress: true
      },
      // 일반 로그
      info: {
        period: '30d',
        compress: true
      },
      // 디버그 로그
      debug: {
        period: '7d',
        compress: false
      }
    }
  }
}; 