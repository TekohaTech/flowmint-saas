# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY FlowMint-backend-nestjs/package*.json ./
RUN npm install --include=dev

COPY FlowMint-backend-nestjs/ ./

# Generate Prisma Client (uses local binary, won't connect to DB)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN ./node_modules/.bin/prisma generate

RUN npm run build

# Stage 2: Create the production image
FROM node:22-slim

WORKDIR /usr/src/app

# Install OpenSSL for Prisma compatibility
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main"]
