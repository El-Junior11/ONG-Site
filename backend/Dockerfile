FROM node:22-alpine AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS production

RUN apk upgrade --no-cache && rm -rf /usr/local/lib/node_modules/npm /opt/yarn /usr/local/lib/node_modules/corepack

WORKDIR /app
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

ENV NODE_ENV=production
USER node

EXPOSE 5000
CMD ["node", "server.js"]