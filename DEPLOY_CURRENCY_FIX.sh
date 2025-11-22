#!/bin/bash
#==============================================================================
# Balkly - Currency Conversion Fix Deployment
#==============================================================================

set -e

echo ""
echo "🚀 =========================================="
echo "🚀  BALKLY - CURRENCY CONVERSION FIX"
echo "🚀 =========================================="
echo ""

cd /var/www/balkly

# Step 1: Pull latest code
echo "📥 Step 1/5: Pulling latest code..."
git fetch origin main
git pull origin main
echo "✓ Code updated"
echo ""

# Step 2: Restart backend container (picks up new CurrencyService)
echo "🔄 Step 2/5: Restarting backend..."
docker-compose restart api
docker-compose restart queue
sleep 5
echo "✓ Backend restarted"
echo ""

# Step 3: Clear Laravel cache
echo "🧹 Step 3/5: Clearing caches..."
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan route:clear
echo "✓ Caches cleared"
echo ""

# Step 4: Restart frontend
echo "🌐 Step 4/5: Restarting frontend..."
docker-compose restart web
sleep 5
echo "✓ Frontend restarted"
echo ""

# Step 5: Start Laravel API server
echo "▶️  Step 5/5: Starting API server..."
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 3
echo "✓ API server started"
echo ""

# Verify API
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""

# Test currency endpoints
echo "📊 Testing currency endpoints..."
echo ""

RATES_CHECK=$(docker exec balkly_api curl -s http://localhost:8000/api/v1/currency/rates | grep -o '"success":true' || echo "")
if [ ! -z "$RATES_CHECK" ]; then
    echo "✅ Currency rates API: Working"
else
    echo "⚠️  Currency rates API: Check manually"
fi

CONVERT_CHECK=$(docker exec balkly_api curl -s -X POST http://localhost:8000/api/v1/currency/convert \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"from":"AED","to":"EUR"}' | grep -o '"success":true' || echo "")
if [ ! -z "$CONVERT_CHECK" ]; then
    echo "✅ Currency convert API: Working"
else
    echo "⚠️  Currency convert API: Check manually"
fi

echo ""
echo "🎯 What's New:"
echo "  ✅ Real-time currency conversion"
echo "  ✅ Support for EUR, AED, USD, GBP, BAM, RSD"
echo "  ✅ Currency switcher in header"
echo "  ✅ All listing prices auto-convert"
echo "  ✅ Exchange rates cached (1 hour)"
echo ""
echo "🌐 Visit: https://balkly.live"
echo "💱 Test: Click globe icon in header to switch currency"
echo ""
echo "=========================================="
echo "🎉 CURRENCY FIX DEPLOYED!"
echo "=========================================="
echo ""

