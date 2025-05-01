# AWS 인프라 설정 가이드

## 1. AWS 계정 설정

### 1.1 IAM 사용자 생성
1. AWS 콘솔에서 IAM 서비스 접속
2. "사용자" → "사용자 추가"
3. 사용자 이름: `snap-codex-admin`
4. 액세스 유형: "프로그래밍 방식 액세스"
5. 권한: "기존 정책 직접 연결"
   - `infra/aws/iam-policies.json`의 정책을 사용

### 1.2 액세스 키 생성
1. 생성된 사용자의 "보안 자격 증명" 탭
2. "액세스 키 만들기" 클릭
3. 액세스 키 ID와 비밀 액세스 키를 안전한 곳에 보관

## 2. 로컬 환경 설정

### 2.1 AWS CLI 설치
```bash
# macOS
brew install awscli

# Linux
sudo apt install awscli

# Windows
choco install awscli
```

### 2.2 AWS CLI 구성
```bash
aws configure
# AWS Access Key ID: [1.2에서 생성한 액세스 키 ID]
# AWS Secret Access Key: [1.2에서 생성한 비밀 액세스 키]
# Default region name: ap-northeast-2
# Default output format: json
```

### 2.3 eksctl 설치
```bash
# macOS
brew install eksctl

# Linux
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Windows
choco install eksctl
```

## 3. GitHub Secrets 설정

1. GitHub 저장소의 "Settings" → "Secrets and variables" → "Actions"
2. 다음 시크릿 추가:
   - `AWS_ACCESS_KEY_ID`: [1.2에서 생성한 액세스 키 ID]
   - `AWS_SECRET_ACCESS_KEY`: [1.2에서 생성한 비밀 액세스 키]
   - `ACM_CERTIFICATE_ARN`: [추후 ACM 인증서 생성 후 ARN]

## 4. 테스트

### 4.1 AWS CLI 테스트
```bash
aws sts get-caller-identity
```

### 4.2 eksctl 테스트
```bash
eksctl version
```

## 5. 다음 단계

1. 인프라 코드 리뷰 및 수정
2. 테스트 환경에서 EKS 클러스터 생성
3. CI/CD 파이프라인 테스트
4. 단계적 마이그레이션 실행 