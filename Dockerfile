 FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${APP_PORT}

RUN npm run build

CMD [ "npm", "run", "start:dev" ]