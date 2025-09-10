FROM node:lts-alpine AS builder

WORKDIR /app
COPY . .
RUN yarn install --production --frozen-lockfile --ignore-scripts

ENV TRANSPORT=http
ENTRYPOINT ["node", "index.js"]
