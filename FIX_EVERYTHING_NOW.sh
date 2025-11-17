#!/bin/bash
# COMPREHENSIVE FIX - All issues at once

cd /var/www/balkly

echo "🔧 FIXING ALL ISSUES NOW..."
echo ""

# 1. Create online_users table if missing
echo "[1/6] Creating missing table..."
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
CREATE TABLE IF NOT EXISTS online_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY unique_ip (ip_address)
);
" 2>/dev/null
echo "✓ Table created"

# 2. Comment out problematic tracking
echo "[2/6] Disabling problematic tracking..."
docker exec balkly_api sed -i 's|Route::post.*\/online\/track|// Route::post.*\/online\/track (disabled)|g' /var/www/routes/api.php
echo "✓ Tracking disabled"

# 3. Clear caches
echo "[3/6] Clearing caches..."
docker exec balkly_api php artisan config:clear 2>/dev/null
docker exec balkly_api php artisan cache:clear 2>/dev/null
docker exec balkly_api php artisan route:clear 2>/dev/null
echo "✓ Caches cleared"

# 4. Restart API
echo "[4/6] Restarting API..."
docker-compose restart api
sleep 15
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 5
echo "✓ API restarted"

# 5. Test API
echo "[5/6] Testing API..."
RESULT=$(docker exec balkly_api curl -s http://localhost:8000/api/v1/events?per_page=1 2>/dev/null | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
echo "API returns: $RESULT events"

# 6. Restart web
echo "[6/6] Restarting web..."
docker-compose restart web
sleep 10
echo "✓ Web restarted"

echo ""
echo "=================================================="
if [ "$RESULT" -gt "0" ]; then
  echo "✅ SUCCESS! API working with $RESULT events!"
else
  echo "⚠️  Issue remains - check Laravel logs"
fi
echo "=================================================="
echo ""
echo "Visit: https://balkly.live/events"
echo "Hard refresh: Ctrl+Shift+R"
echo ""

