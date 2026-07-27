FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/admin/package.json packages/admin/
RUN pnpm install --frozen-lockfile

COPY packages/shared/ packages/shared/
COPY packages/admin/ packages/admin/
RUN pnpm --filter @fuyebang/admin build

FROM nginx:alpine
COPY --from=builder /app/packages/admin/dist /usr/share/nginx/html
EXPOSE 80
