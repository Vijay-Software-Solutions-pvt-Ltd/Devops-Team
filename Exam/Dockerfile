FROM node:18-alpine AS build

WORKDIR /app

COPY client/package*.json ./client/
RUN cd client && npm install

COPY client ./client
RUN cd client && npm run build

COPY server ./server
RUN cd server && npm install

EXPOSE 5000
CMD ["node", "server/index.js"]

