FROM node:18-alpine as base

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install
RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
