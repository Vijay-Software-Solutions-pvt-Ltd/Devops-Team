# FRONTEND BUILD
FROM node:18 AS frontend-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm install -g vite@5
RUN vite build

# BACKEND BUILD
FROM node:18 AS backend
WORKDIR /app/server

COPY server/package*.json ./
RUN npm install --omit=dev

COPY server/ ./

# Copy frontend build to backend public folder
COPY --from=frontend-build /app/client/dist ./public

ENV NODE_ENV=production

# Cloud Run sets PORT automatically
CMD ["node", "src/index.js"]
