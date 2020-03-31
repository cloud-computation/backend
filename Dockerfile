FROM node:10.15.1

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

CMD ["npm", "run", "start"]
