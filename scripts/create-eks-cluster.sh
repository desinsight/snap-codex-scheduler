#!/bin/bash

# AWS CLI와 eksctl이 설치되어 있는지 확인
command -v aws >/dev/null 2>&1 || { echo "AWS CLI가 설치되어 있지 않습니다. 설치해주세요." >&2; exit 1; }
command -v eksctl >/dev/null 2>&1 || { echo "eksctl이 설치되어 있지 않습니다. 설치해주세요." >&2; exit 1; }

# AWS 자격 증명 확인
aws sts get-caller-identity >/dev/null 2>&1 || { echo "AWS 자격 증명이 설정되어 있지 않습니다." >&2; exit 1; }

# EKS 클러스터 생성
echo "EKS 클러스터 생성을 시작합니다..."
eksctl create cluster -f ../infra/aws/eks-cluster.yaml

# 클러스터 생성 확인
if [ $? -eq 0 ]; then
    echo "EKS 클러스터가 성공적으로 생성되었습니다."
    
    # kubeconfig 업데이트
    aws eks update-kubeconfig --name snap-codex-cluster --region ap-northeast-2
    
    # 클러스터 상태 확인
    kubectl get nodes
else
    echo "EKS 클러스터 생성에 실패했습니다."
    exit 1
fi 