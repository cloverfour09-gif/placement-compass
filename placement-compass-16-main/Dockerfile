# ─────────────────────────────────────────────────────────
# Stage 1 – Build (Node 20 LTS)
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only dependency manifests first for layer-cache efficiency
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci --frozen-lockfile

# Copy the entire frontend source
COPY . .

# VITE_ env vars are baked in at build time; they are injected by
# docker-compose / Jenkins as build-args and must NOT contain secrets.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Produce the production bundle under /app/dist
RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 2 – Runtime (Nginx Alpine)
# ─────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our production Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Run Nginx as non-root user (nginx user already exists in the base image)
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Nginx runs in the foreground; no USER directive needed here because
# the master process requires root to bind port 80 but workers drop privileges.
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
