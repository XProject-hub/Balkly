#!/bin/bash
# Add Sports & Hobbies Category to Balkly

cd /var/www/balkly

echo "⚽ Adding Sports & Hobbies category..."

# Seed the new category
docker exec balkly_api php artisan db:seed --class=CategorySeeder --force

echo "✅ Sports & Hobbies category added!"
echo ""
echo "Sport types included:"
echo "  🏀 Basketball"
echo "  ⚽ Football/Soccer"
echo "  🏐 Volleyball"
echo "  🤾 Handball"
echo "  🎾 Tennis"
echo "  🏊 Swimming"
echo "  🚴 Cycling"
echo "  🏋️ Gym/Fitness"
echo "  🥊 Boxing/MMA"
echo "  ⛷️ Skiing/Winter Sports"
echo "  🏄 Water Sports"
echo "  + 50+ more sports & hobbies!"
echo ""
echo "🌐 Test at: https://balkly.live/listings/create"

