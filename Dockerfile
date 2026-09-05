FROM node:22-alpine AS frontend-build

WORKDIR /app/vite-project
COPY vite-project/package*.json ./
RUN npm ci
COPY vite-project/ ./
RUN npm run build

FROM node:22-alpine

WORKDIR /app/api
COPY api/package*.json ./
RUN npm ci --omit=dev
COPY api/ ./
COPY --from=frontend-build /app/vite-project/dist /app/vite-project/dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]