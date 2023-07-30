FROM node:lts-alpine

ENV PORT 4000

EXPOSE $PORT

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]