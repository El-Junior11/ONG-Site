FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN apk upgrade --no-cache && npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

ENV NODE_ENV=production
USER node

EXPOSE 5000
CMD ["node", "server.js"]