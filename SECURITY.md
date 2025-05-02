# Security Policy

## Supported Versions

현재 보안 업데이트가 지원되는 버전:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 보안 취약점 보고

보안 취약점을 발견하신 경우 다음 절차를 따라주세요:

1. 보안팀 연락처:
   - Email: security-team@snapcodex.com
   - 긴급 연락처: security-oncall@snapcodex.com

2. 보고 시 포함할 정보:
   - 취약점 유형 및 심각도
   - 상세한 재현 방법
   - 영향 받는 시스템 및 데이터
   - 가능한 해결 방안
   - POC(Proof of Concept) 코드 (있는 경우)

## 보안 모범 사례

1. 환경 변수 관리
   - 모든 시크릿은 AWS Secrets Manager/HashiCorp Vault 사용
   - 환경별 .env 파일 분리 (.env.development, .env.production)
   - 주기적인 시크릿 로테이션 필수

2. 인증/인가
   - JWT 토큰 사용 (만료 시간 최대 1시간)
   - HTTPS 필수 (TLS 1.3)
   - CORS 정책: 허용된 도메인만 접근
   - Rate Limiting 적용

3. 데이터베이스 보안
   - MongoDB 인증 필수
   - 네트워크 접근 제한
   - 데이터 암호화 (저장 및 전송 시)
   - 일일 백업 및 복구 테스트

4. 모니터링 및 감사
   - Datadog 보안 모니터링
   - 로그 중앙화 (ELK Stack)
   - 이상 징후 탐지 및 알림
   - 정기적인 보안 감사

5. CI/CD 보안
   - 모든 PR에 보안 스캔 필수
   - 의존성 취약점 검사 (npm audit)
   - 컨테이너 이미지 스캔
   - 배포 전 보안 체크리스트 검증

## 사고 대응 절차

1. 탐지 및 보고
   - 보안 사고 발견 즉시 security-oncall@snapcodex.com로 보고
   - 영향 범위 평가
   - 필요시 시스템 격리

2. 대응 및 복구
   - 사고대응팀 소집
   - 취약점 패치 또는 시스템 복구
   - 영향받은 사용자 통보

3. 사후 관리
   - 상세 사고 보고서 작성
   - 재발 방지 대책 수립
   - 보안 정책 및 절차 개선
   - 팀 보안 교육 실시

## 정기 보안 점검

1. 주간 점검
   - 의존성 취약점 스캔
   - 로그 분석
   - 시스템 모니터링 검토

2. 월간 점검
   - 인프라 보안 설정 검토
   - 접근 권한 감사
   - 백업 복구 테스트

3. 분기 점검
   - 외부 보안 감사
   - 침투 테스트
   - 재해 복구 훈련 