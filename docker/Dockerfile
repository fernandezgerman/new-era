# Extends the Laravel Sail 8.4 image and ensures /usr/bin/php-cgi7.0 exists
FROM sail-8.4/app

USER root

# Try to install a PHP CGI SAPI and expose it at /usr/bin/php-cgi7.0.
# On Ubuntu 24.04 with Ondrej PPA (used by Sail), php8.4-cgi is available.
# If php-cgi is not available, create a fallback symlink to /usr/bin/php
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends php8.4-cgi || true; \
    if command -v php-cgi >/dev/null 2>&1; then \
        ln -sf "$(command -v php-cgi)" /usr/bin/php-cgi7.0; \
    else \
        ln -sf /usr/bin/php /usr/bin/php-cgi7.0; \
    fi; \
    rm -rf /var/lib/apt/lists/*

# Override Sail entrypoint with a safer variant to avoid usermod/composer permission issues
COPY docker/start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

# Keep entrypoint running as root
USER root
