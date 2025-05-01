#!/bin/bash

# 시스템 업데이트
yum update -y

# Docker 설치
yum install -y docker
systemctl start docker
systemctl enable docker

# Docker Compose 설치
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Git 설치
yum install -y git

# 애플리케이션 클론
cd /home/ec2-user
git clone https://github.com/desinsight/snap-codex-scheduler.git
cd snap-codex-scheduler

# Docker 이미지 빌드 및 실행
docker build -t snap-codex .
docker run -d -p 80:80 snap-codex 