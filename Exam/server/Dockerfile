FROM node:20

WORKDIR /app/server

# COPY must include server/
COPY server/package*.json ./

RUN npm install --omit=dev

COPY server/src ./src

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "src/index.js"]
