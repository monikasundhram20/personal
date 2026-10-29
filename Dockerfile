FROM node:22

WORKDIR /app

COPY BACKEND/package*.json ./

RUN npm install

COPY BACKEND/ .

EXPOSE 5000

CMD ["node", "server.js"]
