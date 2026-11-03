# syntax=docker/dockerfile:1

FROM --platform=$BUILDPLATFORM node:24.22.1-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --no-audit --no-fund

COPY . .

# Baked into the bundle at build time
ARG VITE_API_URL
RUN test -n "$VITE_API_URL" || { echo "build arg VITE_API_URL is required" >&2; exit 1; }
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30.6-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
