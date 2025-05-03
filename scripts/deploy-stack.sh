#!/bin/bash

# Exit on error
set -e

# Configuration
STACK_NAME="snap-codex-scheduler"
REGION="ap-northeast-2"  # Seoul region
TEMPLATE_FILE="infra/aws/ecs-service.yaml"

# Check if required parameters are provided
if [ -z "$VPC_ID" ] || [ -z "$PRIVATE_SUBNETS" ] || [ -z "$ALB_ARN" ]; then
    echo "Error: Required environment variables are not set"
    echo "Please set the following environment variables:"
    echo "  VPC_ID: The ID of the VPC"
    echo "  PRIVATE_SUBNETS: Comma-separated list of private subnet IDs"
    echo "  ALB_ARN: ARN of the Application Load Balancer"
    exit 1
fi

# Deploy CloudFormation stack
echo "Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides \
        Environment=production \
        VpcId=$VPC_ID \
        PrivateSubnets=$PRIVATE_SUBNETS \
        LoadBalancerArn=$ALB_ARN \
        EcsClusterName=towncent-cluster \
        ContainerPort=80 \
        DesiredCount=2

echo "Waiting for stack deployment to complete..."
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME

echo "Stack deployment completed successfully!"

# Get the service URL
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --names towncent-alb \
    --query 'LoadBalancers[0].DNSName' \
    --output text)

echo "Service is accessible at: https://scheduler.snap-codex.com"
echo "ALB DNS: $ALB_DNS" 