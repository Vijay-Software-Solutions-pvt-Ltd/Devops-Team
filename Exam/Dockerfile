FROM node:18-alpine AS build

# Install required packages for Vite
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ---------------- FRONTEND ----------------

COPY client/package*.json ./client/
RUN cd client && npm install

COPY client ./client
RUN cd client && npx vite build

# ---------------- BACKEND ----------------

COPY server ./server
RUN cd server && npm install

EXPOSE 5000

CMD ["node", "server/index.js"]

