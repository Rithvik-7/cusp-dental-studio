FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY . .

RUN npm ci
RUN npm run build

ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE 8080

CMD ["node", "scripts/start-railway.mjs"]
