#!/bin/bash

# 변수 설정
INSTANCE_TYPE="t2.micro"
AMI_ID="ami-0c9c942bd7bf113a2"  # Amazon Linux 2 AMI ID (ap-northeast-2)
KEY_NAME="snap-codex-key"
SECURITY_GROUP_NAME="snap-codex-sg"
INSTANCE_NAME="snap-codex-server"
VPC_ID=$(aws ec2 describe-vpcs --query 'Vpcs[0].VpcId' --output text)

# 보안 그룹 생성
echo "Creating security group..."
aws ec2 create-security-group \
    --group-name $SECURITY_GROUP_NAME \
    --description "Security group for snap-codex server" \
    --vpc-id $VPC_ID

SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
    --group-names $SECURITY_GROUP_NAME \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

# 보안 그룹 규칙 추가
echo "Adding security group rules..."
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# EC2 인스턴스 생성
echo "Creating EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SECURITY_GROUP_ID \
    --user-data file://scripts/user-data.sh \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "Waiting for instance to be running..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# 인스턴스 정보 출력
echo "Instance $INSTANCE_ID is now running"
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo "Public IP: $PUBLIC_IP" 