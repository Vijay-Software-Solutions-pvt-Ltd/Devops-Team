FROM node:18 AS frontend-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm install -g vite@5
RUN vite build

FROM node:18 AS backend
WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

COPY server/ ./

RUN npm rebuild bcrypt --build-from-source

COPY --from=frontend-build /app/client/dist ./public

EXPOSE 5000
CMD ["npm", "start"]
