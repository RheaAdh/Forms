FROM node:14

WORKDIR usr/src/api

COPY package*.json ./

RUN npm config set registry http://registry.npmjs.org/

RUN npm install --no-package-lock

COPY . .

EXPOSE 7000

CMD ["npm", "start"]