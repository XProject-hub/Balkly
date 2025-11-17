#!/bin/bash
# Complete events setup - import XML and verify

cd /var/www/balkly

echo "🎪 COMPLETE EVENTS SETUP"
echo "======================="
echo ""

# 1. Pull latest code
echo "[1/10] Pulling code..."
git pull origin main
echo ""

# 2. Restart everything
echo "[2/10] Restarting services..."
docker-compose down
docker-compose up -d
sleep 30
echo ""

# 3. Start API
echo "[3/10] Starting Laravel API..."
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 10
echo ""

# 4. Clear caches
echo "[4/10] Clearing caches..."
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan route:clear
echo ""

# 5. Check XML feed accessibility
echo "[5/10] Testing XML feed..."
docker exec balkly_api curl -s "https://platinumlist.net/xml-feed/partnership-program" | head -5
echo ""

# 6. Clear old events
echo "[6/10] Clearing old events..."
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "TRUNCATE TABLE events;" 2>/dev/null
echo "✓ Old events cleared"
echo ""

# 7. Run XML import
echo "[7/10] Importing XML events..."
docker exec balkly_api php artisan platinumlist:fetch
echo ""

# 8. Verify database
echo "[8/10] Checking database..."
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT 
  COUNT(*) as total_events,
  COUNT(CASE WHEN image_url LIKE '%cdn.platinumlist%' THEN 1 END) as real_images,
  COUNT(DISTINCT city) as cities
FROM events WHERE type='affiliate';
" 2>/dev/null
echo ""

# 9. Test API
echo "[9/10] Testing API response..."
TOTAL=$(docker exec balkly_api curl -s http://localhost:8000/api/v1/events 2>/dev/null | grep -o '"total":[0-9]*' | grep -o '[0-9]*' || echo "0")
echo "API returns: $TOTAL events"
echo ""

# 10. Sample events
echo "[10/10] Sample events in database:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT id, title, city, DATE(start_at) as date
FROM events 
WHERE type='affiliate'
LIMIT 5;
" 2>/dev/null

echo ""
echo "=================================================="
if [ "$TOTAL" -gt "0" ]; then
  echo "✅ SUCCESS! $TOTAL events imported and working!"
else
  echo "⚠️  No events found - check logs above for errors"
fi
echo "=================================================="
echo ""
echo "Visit: https://balkly.live/events"
echo ""

