#!/bin/bash
# Test if listings are being created

cd /var/www/balkly

echo "🔍 Checking listings in database..."
echo ""

# Show all listings
echo "📊 All listings in database:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT id, user_id, title, status, created_at 
FROM listings 
ORDER BY created_at DESC 
LIMIT 10;
" 2>/dev/null

echo ""
echo "📊 Count by status:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT status, COUNT(*) as count 
FROM listings 
GROUP BY status;
" 2>/dev/null

echo ""
echo "🔧 Testing my-listings endpoint..."
docker exec balkly_api curl -s http://localhost:8000/api/v1/listings/my-listings \
  -H "Authorization: Bearer test" | head -50

echo ""
echo "📋 Available routes:"
docker exec balkly_api php artisan route:list | grep "my-listings"

echo ""
echo "✅ Check complete!"

