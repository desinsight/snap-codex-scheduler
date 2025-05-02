import { LoadBalancerConfig } from '../types/config';

export const loadBalancerConfig: LoadBalancerConfig = {
  // 로드 밸런싱 알고리즘
  algorithm: 'round-robin',
  
  // 서버 풀 설정
  serverPool: {
    // 최소 서버 수
    minServers: 2,
    // 최대 서버 수
    maxServers: 10,
    // 서버 상태 확인 간격 (ms)
    healthCheckInterval: 5000,
    // 서버 상태 확인 타임아웃 (ms)
    healthCheckTimeout: 2000
  },
  
  // 세션 지속성 설정
  sessionPersistence: {
    enabled: true,
    // 세션 타임아웃 (ms)
    timeout: 1800000, // 30분
    // 세션 쿠키 설정
    cookie: {
      name: 'LB_SESSION',
      secure: true,
      httpOnly: true
    }
  },
  
  // SSL/TLS 설정
  ssl: {
    enabled: true,
    // SSL 프로토콜
    protocols: ['TLSv1.2', 'TLSv1.3'],
    // SSL 암호화 스위트
    ciphers: [
      'ECDHE-ECDSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES128-GCM-SHA256'
    ]
  },
  
  // 부하 분산 설정
  loadDistribution: {
    // 가중치 기반 라우팅
    weighted: true,
    // 최소 연결 수 기반 라우팅
    leastConnections: true,
    // 응답 시간 기반 라우팅
    responseTime: true
  },
  
  // 장애 조치 설정
  failover: {
    // 자동 장애 조치
    automatic: true,
    // 장애 조치 임계값
    threshold: 3,
    // 장애 조치 타임아웃 (ms)
    timeout: 10000
  },
  
  // 모니터링 설정
  monitoring: {
    // 서버 상태 모니터링
    serverHealth: true,
    // 트래픽 모니터링
    traffic: true,
    // 성능 메트릭 수집
    performanceMetrics: true,
    // 알림 설정
    alerts: {
      enabled: true,
      // 서버 다운 알림
      serverDown: true,
      // 과부하 알림
      overload: true,
      // 응답 시간 알림
      responseTime: true
    }
  }
}; 