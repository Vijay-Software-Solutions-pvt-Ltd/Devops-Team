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

# Copy only backend package files
COPY server/package*.json ./
RUN npm install --omit=dev

# Copy backend src correctly
COPY server/src ./src

# Copy frontend dist → backend public
COPY --from=frontend-build /app/client/dist ./src/public

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "src/index.js"]
