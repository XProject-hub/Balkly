#!/bin/bash
cd /var/www/balkly

echo "Starting Laravel API server..."

# Kill any existing artisan serve
docker exec balkly_api pkill -f "artisan serve" 2>/dev/null || true

# Start API server
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"

sleep 3

# Test API
echo "Testing API..."
API_TEST=$(docker exec balkly_api curl -s http://localhost:8000/api/v1/categories | grep -o '\[' | head -1)

if [ ! -z "$API_TEST" ]; then
    echo "✅ API server is running!"
else
    echo "❌ API server not responding"
fi

# Test endpoints
echo ""
echo "Testing endpoints..."
docker exec balkly_api curl -s http://localhost:8000/api/v1/listings | head -20
echo ""
docker exec balkly_api curl -s http://localhost:8000/api/v1/events | head -20
echo ""
docker exec balkly_api curl -s http://localhost:8000/api/v1/forum/categories | head -20

