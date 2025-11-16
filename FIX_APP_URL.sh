#!/bin/bash
#==============================================================================
# Fix APP_URL in .env to use balkly.live instead of localhost
#==============================================================================

echo "🔧 Fixing APP_URL in .env..."

cd /var/www/balkly

# Update APP_URL in .env
docker exec balkly_api sh -c "sed -i 's|APP_URL=.*|APP_URL=https://balkly.live|g' /var/www/.env"

# Also update NEXT_PUBLIC_SITE_URL if it exists
docker exec balkly_api sh -c "sed -i 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://balkly.live|g' /var/www/.env || echo 'NEXT_PUBLIC_SITE_URL=https://balkly.live' >> /var/www/.env"

# Clear config cache
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan cache:clear

# Restart API
docker-compose restart api
sleep 10

# Start Laravel
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"

# Verify the change
echo ""
echo "✅ APP_URL updated!"
docker exec balkly_api cat /var/www/.env | grep "APP_URL"
echo ""
echo "📧 New verification links will use: https://balkly.live"
echo ""

