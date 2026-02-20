# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Prisma
COPY --from=builder /usr/src/app/prisma ./prisma
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/src/main"]
