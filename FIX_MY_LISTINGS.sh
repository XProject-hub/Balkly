#!/bin/bash
# Complete fix for My Listings not showing

cd /var/www/balkly

echo "🔧 Fixing My Listings display..."

# Pull latest code
git pull origin main

# Restart API
docker-compose restart api
sleep 10

# Start Laravel
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 5

# Clear all caches
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan route:clear

echo ""
echo "📊 Checking listings in database..."
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT id, user_id, title, status, created_at 
FROM listings 
ORDER BY created_at DESC 
LIMIT 10;
" 2>/dev/null

echo ""
echo "🔍 Testing my-listings endpoint..."
docker exec balkly_api php artisan route:list | grep "my-listings"

echo ""
echo "✅ Fix complete!"
echo "Visit: https://balkly.live/dashboard/listings"
echo "Check browser console (F12) for logs"

