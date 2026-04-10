# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client (DATABASE_URL needed for schema validation)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine

WORKDIR /usr/src/app

# Install OpenSSL for Prisma compatibility
RUN apk add --no-cache openssl

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

# Ensure Prisma Client is generated in production
RUN npx prisma generate

EXPOSE 3000

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
