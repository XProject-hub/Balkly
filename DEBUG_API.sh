#!/bin/bash
cd /var/www/balkly

echo "Testing API endpoints..."
echo ""

echo "1. Categories:"
docker exec balkly_api curl -s http://localhost:8000/api/v1/categories | head -50

echo ""
echo ""
echo "2. Listings:"
docker exec balkly_api curl -s http://localhost:8000/api/v1/listings | head -50

echo ""
echo ""
echo "3. Events:"
docker exec balkly_api curl -s http://localhost:8000/api/v1/events | head -50

echo ""
echo ""
echo "4. Forum Categories:"
docker exec balkly_api curl -s http://localhost:8000/api/v1/forum/categories | head -100

echo ""
echo ""
echo "5. Forum Topics:"
docker exec balkly_api curl -s http://localhost:8000/api/v1/forum/topics | head -50

echo ""
echo ""
echo "Database check:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT 'Listings' as table_name, COUNT(*) as count FROM listings
UNION ALL SELECT 'Events', COUNT(*) FROM events
UNION ALL SELECT 'Forum Categories', COUNT(*) FROM forum_categories
UNION ALL SELECT 'Forum Topics', COUNT(*) FROM forum_topics
UNION ALL SELECT 'Forum Posts', COUNT(*) FROM forum_posts;
" 2>/dev/null

