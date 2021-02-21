FROM node:latest as base

ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
COPY package.json /app

CMD [ "npm", "start" ]

## Development
FROM base as development
ENV NODE_ENV development
RUN npm i 

CMD [ "npm", "run", "start:dev" ]

## PRODUCTION
FROM base as production 
ENV NODE_ENV production

COPY package-lock.json /app

RUN npm ci

RUN npm run build

