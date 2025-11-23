#!/bin/bash
cd /var/www/balkly

echo "🔧 Osiguravam da API radi..."

# Kill sve postojeće artisan serve procese
docker exec balkly_api pkill -f "artisan serve" 2>/dev/null || true

sleep 2

# Pokreni API server
docker exec -d balkly_api bash -c "nohup php artisan serve --host=0.0.0.0 --port=8000 > /var/www/storage/logs/artisan-serve.log 2>&1 &"

sleep 3

# Test
echo "Testing API..."
curl -s https://balkly.live/api/v1/forum/categories | head -50

echo ""
echo "✅ API server running!"

