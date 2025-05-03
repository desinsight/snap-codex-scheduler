#!/bin/bash

# 현재 로그인된 계정의 기본 리전 설정
REGION="ap-northeast-2"
export PAGER=cat

echo "🔍 VPC 목록 조회 중..."
aws ec2 describe-vpcs --region $REGION \
  --query "Vpcs[*].{VPC_ID:VpcId,Name:Tags[?Key=='Name'].Value|[0],CIDR:CidrBlock}" \
  --output table

echo ""
echo "🔍 서브넷 목록 조회 중..."
aws ec2 describe-subnets --region $REGION \
  --query "Subnets[*].{SubnetId:SubnetId,AZ:AvailabilityZone,VpcId:VpcId,CIDR:CidrBlock,Name:Tags[?Key=='Name'].Value|[0]}" \
  --output table

echo ""
echo "🔍 ALB 목록 조회 중..."
aws elbv2 describe-load-balancers --region $REGION \
  --query "LoadBalancers[*].{Name:LoadBalancerName,DNS:DNSName,ARN:LoadBalancerArn}" \
  --output table

echo ""
echo "🔍 ECS 클러스터 목록 조회 중..."
aws ecs list-clusters --region $REGION \
  --query "clusterArns[]" \
  --output table

echo ""
echo "📝 위 정보에서 아래 항목을 선택해 복사해 주세요:"
echo "- VPC ID (snap-codex-vpc의 VPC ID를 선택해주세요)"
echo "- Subnet ID 2개 이상 (쉼표로 구분)"
echo "- ALB ARN (towncent-alb의 ARN을 선택해주세요)"
echo "- ECS Cluster 이름 (towncent-cluster)" 