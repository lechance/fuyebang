FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/shared/ packages/shared/
COPY packages/server/ packages/server/

# Build
RUN pnpm --filter @fuyebang/server build
RUN pnpm --filter @fuyebang/server prisma:generate

# Production image
FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/packages/server/dist ./dist
COPY --from=builder /app/packages/server/prisma ./prisma
COPY --from=builder /app/packages/server/package.json ./
COPY --from=builder /app/packages/server/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main"]
