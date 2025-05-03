#!/bin/bash

# 현재 로그인된 계정의 기본 리전 설정
REGION="ap-northeast-2"
VPC_ID="vpc-0b18ec53ee5fc8f6c"
VPC_CIDR="10.0.0.0/16"

echo "🔨 서브넷 생성 시작..."

# 가용 영역과 서브넷 CIDR 블록 정의
AZS=("a" "b" "c" "d")
CIDRS=("10.0.1.0/24" "10.0.2.0/24" "10.0.3.0/24" "10.0.4.0/24")

for i in "${!AZS[@]}"; do
    az=${AZS[$i]}
    cidr=${CIDRS[$i]}
    
    echo "Creating subnet in ap-northeast-2${az}..."
    
    # 서브넷 생성
    SUBNET_ID=$(aws ec2 create-subnet \
        --vpc-id $VPC_ID \
        --availability-zone ap-northeast-2${az} \
        --cidr-block ${cidr} \
        --region $REGION \
        --query 'Subnet.SubnetId' \
        --output text)

    if [ -n "$SUBNET_ID" ]; then
        # 태그 추가
        aws ec2 create-tags \
            --resources $SUBNET_ID \
            --tags "Key=Name,Value=snap-codex-private-${az}" \
            --region $REGION

        echo "Created subnet: $SUBNET_ID (${cidr})"
    else
        echo "Failed to create subnet in ap-northeast-2${az}"
    fi
done

echo ""
echo "✅ 서브넷 생성 완료!"
echo "생성된 서브넷 목록을 확인하시겠습니까? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    aws ec2 describe-subnets \
        --filters "Name=vpc-id,Values=$VPC_ID" \
        --query "Subnets[*].{SubnetId:SubnetId,AZ:AvailabilityZone,CIDR:CidrBlock,Name:Tags[?Key=='Name'].Value|[0]}" \
        --output table \
        --region $REGION
fi 