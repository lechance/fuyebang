#!/bin/bash
# Deployment script for fuyebang

set -e

echo "🚀 开始部署副业邦..."

# Load environment
if [ -f .env.production ]; then
  export $(grep -v '^#' .env.production | xargs)
fi

# Pull latest code
echo "📦 拉取最新代码..."
git pull origin main

# Build and start
echo "🏗️  构建并启动服务..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Run database migrations
echo "🗄️  执行数据库迁移..."
docker-compose -f docker-compose.prod.yml exec server npx prisma migrate deploy

echo "✅ 部署完成！"
echo "   API:     https://${API_DOMAIN:-api.fuyebang.com}"
echo "   管理后台: https://${ADMIN_DOMAIN:-admin.fuyebang.com}"
