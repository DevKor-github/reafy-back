FROM node:16-alpine

WORKDIR /app

ADD . /app/

RUN npm install

RUN npm run build

EXPOSE 3001

ENTRYPOINT npm run start:prod