FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080

ENV MODEL_URL=https://storage.googleapis.com/derma-scan/dermascan-model/model.json

EXPOSE 8080

CMD ["npm", "start"]