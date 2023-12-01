FROM node:16-alpine

WORKDIR /app

ADD . /app/

RUN npm ci

RUN npm run build

EXPOSE 3000

ENTRYPOINT npm run start:prod