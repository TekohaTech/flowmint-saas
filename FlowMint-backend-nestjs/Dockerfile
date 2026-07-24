# Stage 1: Build the application
FROM node:22-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --include=dev

COPY ./ .

# Generate Prisma Client (uses local binary, won't connect to DB)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN ./node_modules/.bin/prisma generate

RUN npm run build

# Stage 2: Production dependencies only
FROM node:22-slim AS prod-deps

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

# Stage 3: Create the production image
FROM node:22-slim

WORKDIR /usr/src/app

# Install OpenSSL for Prisma compatibility
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy only what's needed for production
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

# Set ownership
RUN chown -R appuser:appuser /usr/src/app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "process.exit(0)" || exit 1

CMD ["node", "dist/src/main"]
