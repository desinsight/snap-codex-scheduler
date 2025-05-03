# Build stage
FROM node:20.12.2-bullseye-slim AS builder

# Create non-root user for build
RUN groupadd -r builder && useradd -r -g builder -m builder

WORKDIR /app
RUN chown builder:builder /app

USER builder

# Copy package files with correct ownership
COPY --chown=builder:builder package*.json ./

# Install dependencies with security updates
USER root
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        wget \
        git \
        python3 \
        make \
        g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER builder
RUN npm ci --production --no-optional \
    && npm audit fix --production \
    && npm cache clean --force

# Copy project files with correct ownership
COPY --chown=builder:builder . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:1.25.4-alpine-slim

# Add security headers and hardening configurations
COPY nginx-security.conf /etc/nginx/conf.d/security.conf
RUN echo "load_module modules/ngx_http_headers_more_filter_module.so;" > /etc/nginx/modules.conf && \
    echo "worker_processes auto;" > /etc/nginx/nginx.conf && \
    echo "worker_rlimit_nofile 2048;" >> /etc/nginx/nginx.conf && \
    echo "events { worker_connections 1024; }" >> /etc/nginx/nginx.conf

# Install security updates and required packages
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache \
        wget \
        ca-certificates \
        tzdata \
        nginx-mod-http-headers-more \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/*

# Create nginx user and group with fixed IDs
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx

# Copy nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Set proper permissions and security hardening
RUN chmod -R 755 /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 755 /var/run && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    # Remove unnecessary files and directories
    rm -rf /usr/share/nginx/html/*.map && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} \;

# Add security headers
RUN echo "more_set_headers 'X-Frame-Options: SAMEORIGIN';" >> /etc/nginx/conf.d/security.conf && \
    echo "more_set_headers 'X-Content-Type-Options: nosniff';" >> /etc/nginx/conf.d/security.conf && \
    echo "more_set_headers 'X-XSS-Protection: 1; mode=block';" >> /etc/nginx/conf.d/security.conf && \
    echo "more_set_headers 'Referrer-Policy: strict-origin-when-cross-origin';" >> /etc/nginx/conf.d/security.conf && \
    echo "more_set_headers 'Content-Security-Policy: default-src \"self\";';" >> /etc/nginx/conf.d/security.conf

# Add healthcheck with improved parameters
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Expose port
EXPOSE 80

# Switch to non-root user
USER nginx

# Start nginx with reduced privileges
CMD ["nginx", "-g", "daemon off;"] 