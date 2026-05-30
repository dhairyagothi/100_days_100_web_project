# ============================================================================
# 100 Days 100 Web Projects — Docker Container
# Serves the static site using Nginx Alpine for minimal image size
# ============================================================================

FROM nginx:1.27-alpine AS production

LABEL maintainer="100 Days 100 Web Projects Contributors"
LABEL description="Static site showcase of 100+ frontend web projects"
LABEL org.opencontainers.image.source="https://github.com/dhairyagothi/100_days_100_web_project"

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entire static site
COPY . /usr/share/nginx/html/

# Remove files that shouldn't be in the served content
RUN rm -f /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/docker-compose.yml \
    /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/.dockerignore \
    /usr/share/nginx/html/Makefile \
    /usr/share/nginx/html/.htmlhintrc \
    /usr/share/nginx/html/package.json \
    /usr/share/nginx/html/package-lock.json && \
    rm -rf /usr/share/nginx/html/.git \
           /usr/share/nginx/html/.github \
           /usr/share/nginx/html/node_modules

# Expose port 80
EXPOSE 80

# Health check — verify nginx is serving content
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
