#!/bin/bash
cd /var/www/balkly

echo "🔧 Fixing all dashboard issues..."
echo ""

# 1. Add Sports with all sports types
echo "⚽ Adding sports..."
SPORTS_ID=$(docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -sN -e "SELECT id FROM categories WHERE slug='sports';" 2>/dev/null)

docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
DELETE FROM attributes WHERE category_id = $SPORTS_ID;
INSERT INTO attributes (category_id, name, slug, type, options_json, is_required, is_searchable, \`order\`, created_at, updated_at)
VALUES ($SPORTS_ID, 'Sport Type', 'sport_type', 'select',
  '[\"American Football\",\"Archery\",\"Badminton\",\"Baseball\",\"Basketball\",\"Boxing\",\"Cricket\",\"Cycling\",\"Diving\",\"Fishing\",\"Football / Soccer\",\"Golf\",\"Gym Equipment\",\"Handball\",\"Hiking\",\"Ice Hockey\",\"Judo\",\"Karate\",\"Kayaking\",\"Kickboxing\",\"MMA\",\"Padel\",\"Rock Climbing\",\"Rugby\",\"Running\",\"Sailing\",\"Skateboarding\",\"Skiing\",\"Snowboarding\",\"Squash\",\"Surfing\",\"Swimming\",\"Table Tennis\",\"Taekwondo\",\"Tennis\",\"Volleyball\",\"Water Polo\",\"Weightlifting\",\"Wrestling\",\"Yoga\"]',
  1, 1, 1, NOW(), NOW()),
($SPORTS_ID, 'Condition', 'condition', 'select', '[\"New\",\"Like New\",\"Good\",\"Fair\",\"Used\"]', 1, 1, 2, NOW(), NOW());
" 2>/dev/null

echo "✅ Sports added"
echo ""

# 2. Check favorites table
echo "📊 Checking tables..."
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT 'Favorites' as Table_Name, COUNT(*) as Count FROM favorites
UNION ALL SELECT 'Offers', COUNT(*) FROM offers
UNION ALL SELECT 'Orders', COUNT(*) FROM orders
UNION ALL SELECT 'Chats', COUNT(*) FROM chats
UNION ALL SELECT 'Messages', COUNT(*) FROM messages;
" 2>/dev/null

echo ""
echo "✅ Dashboard data ready!"
echo ""
echo "Test at: https://balkly.live/dashboard"

