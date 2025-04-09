FROM node:lts-alpine AS builder
COPY . /app
WORKDIR /app
RUN yarn install --production --frozen-lockfile --ignore-scripts
ENTRYPOINT ["node", "index.js"]
