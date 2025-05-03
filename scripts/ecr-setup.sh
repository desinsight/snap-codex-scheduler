#!/bin/bash

# Exit on error
set -e

# Configuration
REPOSITORY_NAME="snap-codex-scheduler"
REGION="ap-northeast-2"  # Seoul region

# Create ECR repository if it doesn't exist
echo "Creating ECR repository if it doesn't exist..."
aws ecr describe-repositories --repository-names ${REPOSITORY_NAME} --region ${REGION} || \
aws ecr create-repository --repository-name ${REPOSITORY_NAME} --region ${REGION}

# Get ECR repository URI
REPOSITORY_URI=$(aws ecr describe-repositories --repository-names ${REPOSITORY_NAME} --region ${REGION} --query 'repositories[0].repositoryUri' --output text)
echo "ECR Repository URI: ${REPOSITORY_URI}"

# Build Docker image
echo "Building Docker image..."
docker build -t ${REPOSITORY_NAME}:latest .

# Tag the image
echo "Tagging image for ECR..."
docker tag ${REPOSITORY_NAME}:latest ${REPOSITORY_URI}:latest

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${REPOSITORY_URI}

# Push the image
echo "Pushing image to ECR..."
docker push ${REPOSITORY_URI}:latest

echo "ECR setup and image push completed successfully!" 