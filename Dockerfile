FROM node:22-alpine AS deps

copy package*.json ./

RUN npm ci

FROM node:22-alpine AS builder

COPY . .
COPY --from=deps /node_modules ./node_modules
RUN npm run build

FROM node:22-alpine AS runner

COPY --from=builder /next.config.mjs ./
COPY --from=builder /public ./public
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /.next ./.next

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]