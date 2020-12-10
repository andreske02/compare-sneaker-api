FROM node:15.0.1-alpine3.10

WORKDIR /Applications/MAMP/htdocs/Websites/Multec3/Development/Eindwerk/compare-sneaker-api/api

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm",  "start"]
