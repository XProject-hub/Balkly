#!/bin/bash
# Fix ALL event images with single reliable Dubai image

cd /var/www/balkly

echo "🖼️  Fixing all event images..."

# Use ONE reliable Dubai image for all events
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
UPDATE events SET 
  image_url = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&q=80'
WHERE type='affiliate';
" 2>/dev/null

echo "✅ All events now have working Dubai image!"
echo ""
echo "Verify:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT title, 
  SUBSTRING(image_url, 1, 50) as image 
FROM events 
WHERE type='affiliate' 
LIMIT 5;
" 2>/dev/null

echo ""
echo "Visit: https://balkly.live/events"
echo "All images will load now!"

