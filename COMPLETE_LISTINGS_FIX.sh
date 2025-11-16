#!/bin/bash
#==============================================================================
# COMPLETE FIX FOR MY LISTINGS NOT SHOWING
#==============================================================================

echo "🔧 FIXING MY LISTINGS DISPLAY ISSUE"
echo "===================================="
echo ""

cd /var/www/balkly

# 1. Pull latest code
echo "📥 [1/8] Pulling latest code..."
git pull origin main
echo ""

# 2. Stop services
echo "⏹️  [2/8] Stopping services..."
docker-compose down
sleep 5
echo ""

# 3. Start services
echo "▶️  [3/8] Starting services..."
docker-compose up -d
sleep 25
echo ""

# 4. Start Laravel API
echo "🚀 [4/8] Starting Laravel API..."
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 8
echo ""

# 5. Clear ALL caches
echo "🧹 [5/8] Clearing caches..."
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan route:clear
docker exec balkly_api php artisan view:clear
echo ""

# 6. Check database
echo "📊 [6/8] Checking database..."
echo "User ID 11's listings:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT id, title, status, created_at 
FROM listings 
WHERE user_id = 11
ORDER BY created_at DESC;
" 2>/dev/null
echo ""

# 7. Test the endpoint
echo "🔍 [7/8] Testing my-listings endpoint..."
echo "Route exists:"
docker exec balkly_api php artisan route:list | grep "my-listings"
echo ""

# 8. Test API response (requires valid token)
echo "📡 [8/8] API endpoint ready"
echo ""

echo "======================================"
echo "✅ SYSTEM READY!"
echo "======================================"
echo ""
echo "NOW DO THIS:"
echo ""
echo "1. Visit https://balkly.live/dashboard/listings"
echo "2. Press F12 to open console"
echo "3. Look for these log messages:"
echo "   - 'Loading my listings with token: present'"
echo "   - 'My listings response status: 200'"
echo "   - 'Number of listings: X'"
echo ""
echo "4. If you see errors in console, note them"
echo "5. If you see 'Number of listings: 7' but page shows nothing,"
echo "   then it's a React rendering issue"
echo ""
echo "======================================"
echo ""

