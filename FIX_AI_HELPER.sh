#!/bin/bash
# Fix AI Helper for Listings

cd /var/www/balkly

echo "✨ Fixing AI Helper..."

# Restart backend to pick up changes
docker-compose restart api
sleep 3

# Clear cache
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan config:clear

echo ""
echo "✅ AI Helper Fixed!"
echo ""
echo "Features:"
echo "  ✨ Auto-capitalize titles"
echo "  📝 Add structure to descriptions"
echo "  📊 Add bullet points"
echo "  🎯 Add category emojis"
echo "  🏷️  Extract keywords"
echo ""
echo "💡 Works WITHOUT OpenAI API!"
echo ""
echo "🌐 Test: Create a listing and click 'Auto-Enhance Listing'"

