# ==============================================================================
# Ghazara Sales App - Production Multi-Stage Dockerfile
# Pinned Node.js 22 LTS (Alpine Linux) | Non-root User | Zero-Secrets Container
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build & Assets Generation
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (relying strictly on clean lockfile)
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Generate Prisma Client artifact during build stage
RUN npx prisma generate

# Copy application sources
COPY . .

# Run production compilation and bundling
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Minimal Production Runtime
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment variables (No hardcoded secrets or database URLs)
ENV NODE_ENV=production
ENV PORT=8080

# Copy compiled SPA bundle and lightweight server from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Security: Run as unprivileged standard non-root user 'node' (UID: 1000)
USER node

# Expose standard Cloud Run HTTP container port
EXPOSE 8080

# Cloud Run Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# Start production server (Migrations must be executed in CI before container launch)
CMD ["node", "server/index.mjs"]
