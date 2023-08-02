FROM node:lts-alpine

ENV PORT 4000

EXPOSE $PORT

WORKDIR /app

COPY package*.json ./

RUN apk update && apk add --no-cache postgresql-client

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]