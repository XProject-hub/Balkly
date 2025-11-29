#!/bin/bash
cd /var/www/balkly

echo "Fixing favorites backslash issue..."

# Update favorites table - fix class names
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
UPDATE favorites 
SET favoritable_type = REPLACE(favoritable_type, 'App\\\\\\\\Models\\\\\\\\Listing', 'App\\\\Models\\\\Listing');

UPDATE favorites 
SET favoritable_type = REPLACE(favoritable_type, 'App\\\\\\\\Models\\\\\\\\Event', 'App\\\\Models\\\\Event');
" 2>/dev/null

echo "✅ Favorites fixed!"
echo ""
echo "Updated favorites:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT id, user_id, favoritable_type, favoritable_id FROM favorites LIMIT 5;
" 2>/dev/null

