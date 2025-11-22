#!/bin/bash
cd /var/www/balkly

echo "Provjeravam bazu..."
echo ""

docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT 'Forum Categories' as Info, COUNT(*) as Count FROM forum_categories
UNION ALL
SELECT 'Forum Subcategories', COUNT(*) FROM forum_subcategories  
UNION ALL
SELECT 'Forum Topics', COUNT(*) FROM forum_topics
UNION ALL
SELECT 'Forum Posts', COUNT(*) FROM forum_posts
UNION ALL
SELECT 'Listings', COUNT(*) FROM listings
UNION ALL
SELECT 'Events', COUNT(*) FROM events;
" 2>/dev/null

echo ""
echo "Testiram API..."
curl -s http://localhost:8000/api/v1/forum/categories | jq '.categories | length'
curl -s http://localhost:8000/api/v1/forum/topics | jq '.data | length'

