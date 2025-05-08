# Snap Codex Scheduler

[![Deploy to GitHub Pages](https://github.com/desinsight/snap-codex-scheduler/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/desinsight/snap-codex-scheduler/actions/workflows/deploy-pages.yml)

알림 스케줄링 및 관리 시스템

---

## SnapCodex 개발 과정 요약 (한글)

### 1. 초기 원칙 및 정적 프로토타이핑
- SnapCodex의 5대 핵심 원칙(쉽게, 진화, 설명 가능, 범용, 유용성)에 대한 HTML 슬라이드 제작.
- 각 원칙별로 Tailwind CSS를 활용한 현대적 UI의 정적 HTML 파일 제작.

### 2. 온보딩, 다음 단계, 시나리오 슬라이드
- 온보딩, 다음 단계, 각 원칙별 슬라이드 제작 및 고유 색상, 아이콘, 콘텐츠 블록 적용.
- 온보딩 슬라이드에 5단계 프로세스와 사용자 후기 포함.

### 3. React SPA 통합
- Vite 기반 React/TypeScript SPA로 마이그레이션 제안 및 구현.
- PrincipleCard, TechnicalTable, PrincipleDetail 등 컴포넌트와 원칙 데이터 구조 생성.
- react-router-dom을 활용한 라우팅 및 동적 원칙/시나리오 페이지 구현.

### 4. 네비게이션 및 레이아웃
- 공통 네비게이션 바(Navigation.tsx)와 레이아웃 컴포넌트(Layout.tsx) 구현.
- Home, Principles, Demo, Scenarios, About 등 주요 섹션 링크 제공.
- 브랜드 및 소셜/연락처 링크가 포함된 푸터 추가.

### 5. 홈페이지 및 히어로 섹션
- 브랜드, 애니메이션 배경, 주요 섹션 바로가기 버튼이 포함된 Hero 섹션으로 홈페이지 리디자인.

### 6. 시나리오 시스템 구현
- 시나리오 목록 및 5개 상세 시나리오 페이지 제작, 단계별 흐름, 예시 이미지, "목록으로 돌아가기" 버튼 포함.

### 7. 다크 모드, 반응형, 접근성
- Tailwind 다크 모드 활성화 및 토글 버튼 구현.
- aria-label, 색상 대비, 키보드 네비게이션 등 접근성 개선.
- Tailwind의 그리드/간격 유틸리티로 반응형 디자인 적용.

### 8. 빌드, 미리보기, 에러 처리
- 캐시 삭제, 재빌드, 미리보기 등 빌드/배포 과정 안내.
- 포트 충돌, import 경로, 인라인 스타일 등 문제 진단 및 해결.

### 9. UI/UX 및 콘텐츠 개선
- 시나리오 링크 추가, "Back" 버튼 및 네비게이션 동작 보장, 사용자 여정 최적화.
- "About SnapCodex" 섹션 및 About 페이지 추가, 미션/비전/핵심가치 명확화.

### 10. 시나리오 및 데모 상호작용
- 파일 업로드(모킹), 단계별 가이드, 결과 미리보기, 사용자 피드백 폼(별점/코멘트) 등 인터랙티브 요소 추가.
- 이미지 최적화(lazy loading, width/height 지정).

### 11. Breadcrumbs 및 네비게이션 개선
- 모든 페이지에 Breadcrumbs 컴포넌트 추가, 네비게이션 및 맥락성 강화.
- aria-label, 포커스 스타일 등 접근성 향상.

### 12. 디자인 시스템 및 접근성 마무리
- 모든 컴포넌트(카드, 버튼, 네비, Breadcrumbs, 다크모드 토글)의 일관된 다크모드/반응형/접근성 보장.
- 폼, 버튼, 이미지의 aria-label, alt, 키보드 접근성 점검.

### 13. 성능 최적화
- 주요 라우트에 React.lazy, Suspense 적용(코드 스플리팅).
- 로딩 UI, 스켈레톤 제안.
- 이미지 WebP, lazy loading 등 적용.

### 14. 버전 관리 및 협업
- 모든 주요 변경사항을 GitHub에 커밋/푸시, 명확한 커밋 메시지 작성.

---

**요약:**
이 대화는 SnapCodex의 현대적, 접근성, 성능 중심의 React SPA 구축 전 과정을 다룹니다.
정적 프로토타입 → React 마이그레이션 → 컴포넌트화 → 라우팅/네비게이션 → 온보딩/시나리오 흐름 → 다크모드/접근성 → 상호작용/성능 최적화 → 배포까지, 단계별로 상세한 설명과 개선이 이루어졌습니다.

---

## 배포 URL

- GitHub Pages: <https://desinsight.github.io/snap-codex-scheduler/>

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
