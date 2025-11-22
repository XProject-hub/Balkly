#!/bin/bash
cd /var/www/balkly

echo "🎨 Deploying XenForo-style forum design..."

git pull origin main

# Run XenForo migrations
docker exec balkly_api php artisan migrate --force

# Restart web
docker-compose restart web

sleep 5

echo ""
echo "✅ XenForo Design Deployed!"
echo ""
echo "Features:"
echo "  📊 Table layout with columns"
echo "  👤 Avatars on left"
echo "  📈 Stats columns (Replies, Views)"
echo "  🕒 Last post info"
echo "  📌 Thread icons (Sticky, Locked, Solved)"
echo "  🎯 Clean XenForo-style look"
echo ""
echo "Visit: https://balkly.live/forum"

