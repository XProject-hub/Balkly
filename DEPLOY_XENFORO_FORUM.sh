#!/bin/bash
cd /var/www/balkly

echo "=========================================="
echo "🚀 DEPLOYING XENFORO-STYLE FORUM"
echo "=========================================="
echo ""

# Pull latest
git pull origin main

# Run migrations
echo "📊 Running database migrations..."
docker exec balkly_api php artisan migrate --force

# Clear caches
echo "🧹 Clearing caches..."
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan route:clear

# Restart services
echo "🔄 Restarting services..."
docker-compose restart api web
sleep 5

echo ""
echo "=========================================="
echo "✅ XENFORO FORUM DEPLOYED!"
echo "=========================================="
echo ""
echo "NEW FEATURES:"
echo ""
echo "✨ Full Width Layout (1400px max)"
echo "❤️  Reactions (Like, Love, Haha, Wow, Sad, Angry)"
echo "💬 Quote Reply - click 'Quote' on any post"
echo "👁️  Watch Thread - get notifications"
echo "✓  Best Answer - mark helpful replies"
echo "🏷️  Thread Prefixes ([Question], [Sale], etc.)"
echo "@  Mentions - tag users with @username"
echo "🏆 User Reputation & Stats"
echo "🔒 Lock/Unlock Threads"
echo "📊 User Profiles with post count"
echo ""
echo "Test at: https://balkly.live/forum"
echo ""

