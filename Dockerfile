FROM node:latest

RUN npm install -g sails

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1337

CMD [ "sails", "lift" ]
