FROM node:18-alpine AS build

WORKDIR /app

COPY Exam/client/package*.json ./Exam/client/
RUN cd Exam/client && npm install

COPY Exam/client ./Exam/client
RUN cd Exam/client && npm run build

COPY Exam/server ./Exam/server
RUN cd Exam/server && npm install

EXPOSE 5000
CMD ["node", "Exam/server/index.js"]

