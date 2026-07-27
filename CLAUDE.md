# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**副业邦** — 副业资讯 & 创业评测微信小程序。pNPM monorepo 包含 4 个包：

| Package | Path | Tech | Description |
|---|---|---|---|
| `@fuyebang/shared` | `packages/shared/` | TypeScript | 前后端共享类型 & 常量 |
| `@fuyebang/server` | `packages/server/` | NestJS + Prisma + PostgreSQL + Redis | RESTful API 后端 |
| `@fuyebang/client` | `packages/client/` | uni-app (Vue 3 + Pinia) | 微信小程序前端 |
| `@fuyebang/admin` | `packages/admin/` | Vue 3 + Element Plus | 管理后台 SPA |

## Commands

```bash
pnpm install              # 安装所有依赖
pnpm dev:server           # 启动 NestJS 后端 (localhost:3000)
pnpm dev:client           # 启动 uni-app 小程序开发
pnpm dev:admin            # 启动管理后台 (localhost:5173)
pnpm build                # 构建所有包
pnpm lint                 # 类型检查

# Database
cd packages/server
npx prisma migrate dev --name <name>   # 创建数据库迁移
npx prisma generate                    # 生成 Prisma Client
npx prisma studio                      # 打开数据库管理 UI
npx prisma migrate deploy              # 生产环境迁移

# Docker (local dev)
docker-compose up -d                   # 启动 PostgreSQL + Redis

# Docker (production)
bash deploy.sh                         # 完整部署流程
```

## Architecture

### 后端 (NestJS) — `packages/server/src/`

```
main.ts                      # 入口：全局 Guards/Interceptors/Filters/Pipes
app.module.ts                # 根模块，注册所有业务模块
prisma/                      # PrismaService (全局注入)
redis/                       # RedisService (缓存/热词/限流)
config/                      # JWT / WeChat 配置
common/
  decorators/                # @CurrentUser, @Roles, @Public
  guards/                    # JwtAuthGuard (默认全局), RolesGuard
  interceptors/              # TransformInterceptor → {code, message, data, meta}
  filters/                   # AllExceptionsFilter
  dto/                       # PaginationDto + paginate()
modules/
  auth/                      # 微信登录 (code→openid→JWT) + Admin 登录
  users/                     # 用户资料
  reviews/                   # 核心：5 维评分 + 步骤 + 用户评价
  side-hustles/              # 副业库
  articles/                  # 行业资讯
  guides/                    # 创业指南 + 工具推荐
  scams/                     # 骗局举报/审核
  community/                 # 社区帖子/评论/点赞
  home/                      # 首页聚合 (Banner/推荐/快讯)
  search/                    # 全局搜索 + 热搜建议
  banners/ / favorites/ / history/ / notifications/ / upload/ / analytics/
```

**关键约定：**
- 所有 API 响应统一 `{code, message, data, meta}` 格式 (TransformInterceptor)
- JWT Auth Guard 默认全局启用，公开接口用 `@Public()` 装饰器
- Admin 路由前缀 `/admin/v1/...`，需 `ADMIN` 或 `SUPER_ADMIN` 角色
- 用户端路由前缀 `/v1/...`（`main.ts` 中全局设置）
- 评测打分在 `@fuyebang/shared` 的 `calculateOverall()` 函数中计算

### 前端 (uni-app) — `packages/client/src/`

```
pages/
  tabbar/                    # 5 个底部 Tab (home/review/news/community/profile)
  subpkg-review/             # 评测子包 (detail/compare/ranking)
  subpkg-news/               # 资讯子包 (article-detail/category)
  subpkg-hustle/             # 副业子包 (list/detail)
  subpkg-guide/              # 指南子包 (list/detail/tools)
  subpkg-scam/               # 避坑子包 (list/detail/report)
  subpkg-community/          # 社区子包 (post-detail/create-post/search)
  subpkg-user/               # 用户子包 (favorites/history/notifications/settings...)

api/                         # API 封装 (request.ts + 模块文件)
store/                       # Pinia stores (user.ts + app.ts)
```

**路由声明在 `pages.json`**，分包加载。Tab 页在主包，其余在 `subPackages` 中。

### 共享包 — `packages/shared/src/`

- `types/` — 10 个类型文件（user/review/article/side-hustle/guide/scam/community/home/notification/common）
- `constants/` — 分类/状态/评测维度
- 评测综合分计算：`calculateOverall()` 在 `types/review.ts`

### API 模式

用户端: `GET /v1/reviews`, `GET /v1/reviews/:slug`, `GET /v1/home` ...
管理端: `GET /v1/admin/reviews`, `POST /v1/admin/reviews`, `PUT /v1/admin/reviews/:id/status` ...

Admin 端独立 controller（如 `AdminReviewsController`），与用户端 controller 分开，统一用 `@Roles('ADMIN')` 保护。

### 数据库

Prisma schema: `packages/server/prisma/schema.prisma`（PostgreSQL）

核心表: `users`, `reviews` (5 维评分), `review_steps`, `side_hustles`, `articles`, `scam_reports`, `community_posts`, `community_comments`, `categories`, `tags`

多态关联: `Categorization(entityId + entityType)` / `Taggable` 表
收藏: `UserFavorite(userId + entityId + entityType)` 组合唯一

### 评测评分

5 维度各 0-10 分。综合分加权:
```
overall = earnings*0.25 + (10-risk)*0.20 + stability*0.20 + (10-difficulty)*0.15 + compliance*0.20
```
权重在 `SCORE_WEIGHTS` 常量中定义，支持后台动态调整。

### 缓存策略

Redis 服务: `packages/server/src/redis/redis.service.ts`
- `getOrSet<T>(key, fetchFn, ttl)` — 先读缓存，miss 则回源并写入
- 首页 `home:feed` — TTL 120s
- 推荐 `home:recommended:N` — TTL 300s
- 搜索建议 `suggest:{keyword}` — TTL 60s
- 热搜词 `hot:search:{YYYY-MM-DD}` — 24h 自动过期
- 缓存失效: `delPattern('home:*')` 在内容变更时调用

### 认证流程

1. 微信小程序 `wx.login()` → code → `POST /v1/auth/login`
2. 后端换取 openid → 查找或创建用户 → 返回 JWT
3. JWT 默认 7 天过期，通过 `Authorization: Bearer <token>` 携带
4. Admin 端: `POST /v1/admin/auth/login`（bcrypt 验证，开发模式 admin/admin123）

### 部署

```bash
# 生产环境需要配置的变量:
# - .env.production: DB_PASSWORD, REDIS_PASSWORD, JWT_SECRET, WECHAT_APPID, WECHAT_SECRET
# - SSL 证书: ssl/fullchain.pem + ssl/privkey.pem
# - 域名 DNS: api.fuyebang.com → 服务器, admin.fuyebang.com → 服务器

./deploy.sh  # 拉取代码 → Docker 构建 → 启动服务 → 执行迁移
```
