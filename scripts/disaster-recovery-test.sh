#!/bin/bash

# 재해 복구 테스트 스크립트

# 환경 변수 설정
NAMESPACE=default
BACKUP_NAME=daily-backup
RESTORE_NAME=disaster-recovery-test

# 1. 현재 상태 백업
echo "Creating backup of current state..."
velero backup create $BACKUP_NAME --include-namespaces $NAMESPACE

# 2. 백업 확인
echo "Verifying backup..."
velero backup describe $BACKUP_NAME

# 3. 테스트를 위한 리소스 삭제
echo "Deleting resources for test..."
kubectl delete deployment snap-codex-scheduler -n $NAMESPACE
kubectl delete service snap-codex-scheduler -n $NAMESPACE

# 4. 복구 실행
echo "Restoring from backup..."
velero restore create $RESTORE_NAME --from-backup $BACKUP_NAME

# 5. 복구 상태 확인
echo "Checking restore status..."
velero restore describe $RESTORE_NAME

# 6. 애플리케이션 상태 확인
echo "Verifying application status..."
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE

# 7. 복구 테스트 결과 출력
if kubectl get pods -n $NAMESPACE | grep -q "Running"; then
    echo "Disaster recovery test completed successfully!"
else
    echo "Disaster recovery test failed!"
    exit 1
fi 