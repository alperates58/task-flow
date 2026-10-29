# Multi-stage production build for task-flow
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy built static assets from builder
COPY --from=builder /app/dist .

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Support both standard HTTP port (80) and existing Coolify port (4173)
EXPOSE 80 4173

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:4173/healthz || wget --quiet --tries=1 --spider http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
