#!/bin/bash
# Add Notifications System to Balkly

cd /var/www/balkly

echo "📬 Adding Notifications System..."

# Run migration
docker exec balkly_api php artisan migrate --force

# Clear caches
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan route:clear

echo ""
echo "✅ Notifications System Added!"
echo ""
echo "Features:"
echo "  ❤️  Forum Like Notifications"
echo "  💬  Forum Reply Notifications"
echo "  ✉️  New Message Notifications"
echo "  💰  Offer Notifications"
echo ""
echo "🔔 Users will now get notified for:"
echo "  • Someone likes their forum post/topic"
echo "  • Someone replies to their topic"
echo "  • Someone sends them a message"
echo "  • Someone makes/accepts/rejects an offer"
echo ""
echo "🌐 Test at: https://balkly.live"

