  FROM node:22-alpine
  RUN apk add --no-cache libc6-compat openssl
  WORKDIR /app
  COPY package*.json ./
  COPY prisma ./prisma
  COPY prisma.config.ts ./
  RUN npm ci
  COPY . .
  RUN npm run build
  EXPOSE 3000
  ENV NODE_ENV=production PORT=3000
  CMD ["sh", "-c", "npx prisma db push && npm start"]
