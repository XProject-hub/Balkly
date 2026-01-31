FROM php:8.3-fpm-alpine

# Install system dependencies (sorted alphabetically)
RUN apk add --no-cache \
    bash \
    curl \
    freetype-dev \
    git \
    libjpeg-turbo-dev \
    libpng-dev \
    libzip-dev \
    mysql-client \
    nginx \
    supervisor \
    unzip \
    zip

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo \
        pdo_mysql \
        zip \
        bcmath \
        opcache \
        exif \
        pcntl

# Copy OPcache configuration for maximum performance
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Install Redis extension
RUN apk add --no-cache \
        pcre-dev \
        autoconf \
        dpkg-dev \
        dpkg \
        file \
        g++ \
        gcc \
        libc-dev \
        make \
        pkgconf \
        re2c \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del --no-cache \
        pcre-dev \
        autoconf \
        dpkg-dev \
        dpkg \
        file \
        g++ \
        gcc \
        libc-dev \
        make \
        pkgconf \
        re2c

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first
COPY composer.json composer.lock* ./

# Set permissions for composer cache
RUN mkdir -p /var/www/.composer && chown -R www-data:www-data /var/www/.composer

# Copy existing application directory
COPY . .

# Create Laravel directories and set permissions (merged for efficiency)
RUN mkdir -p /var/www/storage/framework/cache \
    && mkdir -p /var/www/storage/framework/sessions \
    && mkdir -p /var/www/storage/framework/views \
    && mkdir -p /var/www/storage/logs \
    && mkdir -p /var/www/storage/app/public \
    && mkdir -p /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Copy and set up entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port
EXPOSE 8000

# Use entrypoint for Laravel optimization
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

