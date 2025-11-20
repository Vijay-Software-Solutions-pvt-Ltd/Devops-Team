FROM node:18 AS frontend-build
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install --include=dev

COPY client/ ./

# Force install vite globally (prevents PATH issues)
RUN npm install -g vite@5

# Run vite build with the global binary
RUN /usr/local/bin/vite build


FROM node:18 AS backend
WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

COPY server/ ./

COPY --from=frontend-build /app/client/dist ./public

EXPOSE 5000
CMD ["npm", "start"]
