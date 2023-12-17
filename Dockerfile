# Builder
FROM node:latest as build-stage

RUN yarn global add http-server

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY ./ .
RUN yarn build

CMD ["http-server", "dist", "-c-1", "-p", "8080"]
