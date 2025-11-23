# FRONTEND BUILD
FROM node:20 AS frontend-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm install -g vite@5
RUN vite build

# BACKEND BUILD
FROM node:20 AS backend
WORKDIR /app/server

COPY server/package*.json ./
RUN npm install --omit=dev

COPY server/ ./

# Copy frontend build to backend public folder
COPY --from=frontend-build /app/client/dist ./public

# Cloud Run requires exposing port
EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "src/index.js"]
