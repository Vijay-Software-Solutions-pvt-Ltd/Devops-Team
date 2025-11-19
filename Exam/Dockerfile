FROM node:18-alpine AS build

WORKDIR /app

COPY Exam/client/package*.json ./client/
RUN cd client && npm install

COPY Exam/client ./client
RUN cd client && npm run build

COPY Exam/server ./server
RUN cd server && npm install

EXPOSE 5000
CMD ["node", "server/index.js"]

