#!/bin/bash
# Quick fix for Docker Compose error

cd /var/www/balkly

echo "🔧 Fixing Docker containers..."

# Stop and remove old containers
docker-compose down
docker container prune -f

# Start fresh
docker-compose up -d

# Wait for services
sleep 15

# Install composer deps
docker exec balkly_api composer install --no-interaction

# Clear cache
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan config:clear

# Start API server
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"

echo "✅ DONE!"
echo "🌐 Visit: https://balkly.live"

