# PHP 7.0 Apache for legacy SOAP services
FROM php:7.0-apache

# Set working directory to SoapServices (entry point base)
WORKDIR /var/www/html/SoapServices

# Install required libs and PHP extensions (SOAP requires libxml2-dev)
RUN set -eux; \
    sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list; \
    sed -i '/security.debian.org/d' /etc/apt/sources.list || true; \
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid;
RUN apt-get update; \
    apt-get install -y --no-install-recommends libxml2-dev; \
    docker-php-ext-install soap mbstring; \
    a2enmod rewrite; \
    rm -rf /var/lib/apt/lists/*

# Configure Apache to serve from SoapServices/paginas/webservices
COPY soap-vhost.conf /etc/apache2/sites-available/000-default.conf

# Expose Apache port (container internal). Host will map to a custom port in docker-compose
EXPOSE 80
