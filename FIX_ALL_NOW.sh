#!/bin/bash
cd /var/www/balkly

echo "🔧 Fixing everything..."

# Run migrations
docker exec balkly_api php artisan migrate --force

# Seed forum categories
docker exec balkly_api php artisan db:seed --class=ForumCategoriesSeeder --force

# Clear caches
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan route:clear

# Restart
docker-compose restart api web

sleep 5

# Start API server
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"

sleep 3

# Test
echo ""
echo "Testing..."
docker exec balkly_api curl -s http://localhost:8000/api/v1/forum/categories | grep -o '"categories":' | head -1

echo ""
echo "✅ Done! Visit: https://balkly.live/forum"

