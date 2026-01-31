#!/bin/bash
set -e

echo "🚀 Starting Balkly API..."

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL..."
until mysql -h"${DB_HOST:-mysql}" -u"${DB_USERNAME:-balkly}" -p"${DB_PASSWORD:-balkly_password}" -e "SELECT 1" &> /dev/null; do
  sleep 2
done
echo "✅ MySQL is ready!"

# Run migrations if needed (only in production, skip if tables exist)
if [ "$APP_ENV" = "production" ]; then
    echo "📦 Running migrations..."
    php artisan migrate --force --no-interaction || true
fi

# Optimize Laravel for production
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Create storage link if not exists
php artisan storage:link 2>/dev/null || true

echo "✅ Laravel optimized!"
echo "🌐 Starting PHP-FPM..."

# Start PHP-FPM
exec php-fpm
