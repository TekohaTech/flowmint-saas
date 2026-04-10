# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client (DATABASE_URL needed for schema validation)
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

# Run migrations and start the server
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/src/main"]
