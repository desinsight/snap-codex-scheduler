# SnapCodex Scheduler

알림 스케줄링 및 관리 시스템

## 기능

- 알림 생성 및 관리
- 이메일 알림 전송
- 웹소켓 실시간 알림
- 캘린더 연동
- 알림 템플릿 관리
- 사용자 인증 및 권한 관리

## 기술 스택

- Frontend: React, TypeScript, Styled Components
- Backend: Node.js, Express
- Database: PostgreSQL
- Cache: Redis
- Email: SendGrid/AWS SES
- WebSocket: Socket.io
- Authentication: JWT
- Monitoring: Prometheus, Grafana

## 시작하기

### 필수 조건

- Node.js 16.x 이상
- PostgreSQL 12.x 이상
- Redis 6.x 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/snap-codex-scheduler.git

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

### 개발 서버 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm run build
npm start
```

## 테스트

```bash
# 단위 테스트
npm test

# 테스트 커버리지
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

## 배포

### Docker 사용

```bash
# 이미지 빌드
docker build -t snap-codex-scheduler .

# 컨테이너 실행
docker run -p 3000:3000 snap-codex-scheduler
```

### AWS Elastic Beanstalk

```bash
# 배포
eb deploy
```

## 문서

- [API 문서](docs/api.md)
- [아키텍처 문서](docs/architecture.md)
- [보안 가이드](docs/security.md)
- [배포 가이드](docs/deployment.md)

## 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 라이센스

MIT License
