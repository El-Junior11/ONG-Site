FROM node:20.19.5-alpine3.22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --include=dev --no-audit --no-fund

RUN test -x node_modules/.bin/vite

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]