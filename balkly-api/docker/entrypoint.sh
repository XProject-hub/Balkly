#!/bin/bash
set -e

echo "🚀 Starting Balkly API..."

# Fix permissions first (critical!)
echo "🔧 Fixing permissions..."
mkdir -p /var/www/storage/framework/cache/data
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/storage/logs
mkdir -p /var/www/bootstrap/cache
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache
echo "✅ Permissions fixed!"

# Install composer dependencies if not already installed
if [ ! -d "/var/www/vendor" ]; then
    echo "📦 Installing composer dependencies..."
    composer install --no-dev --optimize-autoloader --no-interaction
fi

# Wait for MySQL to be ready (using bash instead of nc which may not be installed)
echo "⏳ Waiting for MySQL..."
until php -r "new PDO('mysql:host=${DB_HOST:-mysql};port=3306', '${DB_USERNAME:-balkly}', '${DB_PASSWORD:-balkly_pass}');" 2>/dev/null; do
  echo "MySQL not ready yet, waiting..."
  sleep 2
done
sleep 3
echo "✅ MySQL is ready!"

# Run migrations if needed (only in production, skip if tables exist)
if [ "$APP_ENV" = "production" ]; then
    echo "📦 Running migrations..."
    php artisan migrate --force --no-interaction || true
fi

# Optimize Laravel for production
echo "⚡ Optimizing Laravel..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true
php artisan event:cache || true

# Create storage link if not exists
php artisan storage:link 2>/dev/null || true

echo "✅ Laravel optimized!"

# If a command was passed (from docker-compose), run it
# Otherwise, default to php-fpm
if [ $# -gt 0 ]; then
    echo "🌐 Executing command: $@"
    exec "$@"
else
    echo "🌐 Starting PHP-FPM..."
    exec php-fpm
fi
