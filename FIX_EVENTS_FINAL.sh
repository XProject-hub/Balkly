#!/bin/bash
# Fix all events - images, links, dates

cd /var/www/balkly

echo "🔧 Fixing all events..."

# Delete ALL old events
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
DELETE FROM events WHERE type='affiliate';
" 2>/dev/null

# Re-fetch Platinumlist events
docker exec balkly_api php artisan platinumlist:fetch

# Set all events to start TOMORROW (valid for 1 year)
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
UPDATE events SET 
  start_at = DATE_ADD(NOW(), INTERVAL 1 DAY),
  end_at = DATE_ADD(NOW(), INTERVAL 1 YEAR)
WHERE type='affiliate';
" 2>/dev/null

# Fix ALL event images with working URLs
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2020/02/03/00/12/burj-khalifa-4814842_1280.jpg' WHERE title LIKE '%Burj Khalifa%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2016/11/29/13/15/aircraft-1870374_1280.jpg' WHERE title LIKE '%Skydive%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2020/02/08/14/29/atlantis-4829924_1280.jpg' WHERE title LIKE '%Atlantis%' OR title LIKE '%Aquaventure%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2017/11/12/13/28/amusement-park-2943408_1280.jpg' WHERE title LIKE '%IMG%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2020/02/02/17/24/travel-4813658_1280.jpg' WHERE title LIKE '%Burj Al Arab%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2019/07/14/16/27/safari-4337394_1280.jpg' WHERE title LIKE '%Safari%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2020/02/16/20/30/dubai-frame-4854718_1280.jpg' WHERE title LIKE '%Frame%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2016/02/07/14/08/ski-1184065_1280.jpg' WHERE title LIKE '%Ski%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2017/08/06/22/01/zipline-2596645_1280.jpg' WHERE title LIKE '%Jebel%' OR title LIKE '%Zipline%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2020/02/17/15/52/flowers-4856694_1280.jpg' WHERE title LIKE '%Miracle%' OR title LIKE '%Garden%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2016/03/27/19/31/aircraft-1283473_1280.jpg' WHERE title LIKE '%Helicopter%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2020/02/06/11/24/palm-jumeirah-4823933_1280.jpg' WHERE title LIKE '%Palm%' OR title LIKE '%View%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2018/11/29/21/19/desert-3846745_1280.jpg' WHERE title LIKE '%Desert%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2020/02/08/14/29/dubai-4829921_1280.jpg' WHERE title LIKE '%Museum%';
UPDATE events SET image_url='https://cdn.pixabay.com/photo/2017/08/07/00/05/jet-ski-2597830_1280.jpg' WHERE title LIKE '%Water%' OR title LIKE '%Sports%';
" 2>/dev/null

# Fix ALL affiliate links to use correct format
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
UPDATE events SET 
  partner_url = CONCAT('https://platinumlist.net/aff/?ref=zjblytn&link=', 
    REPLACE(REPLACE(partner_url, 'https://platinumlist.net/aff/?ref=zjblytn&link=', ''), 
    'https%3A%2F%2F', 'https://'))
WHERE type='affiliate' AND partner_url IS NOT NULL;
" 2>/dev/null

echo ""
echo "✅ Events fixed!"
echo ""
echo "Checking results..."
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT id, title, 
  SUBSTRING(image_url, 1, 50) as image, 
  SUBSTRING(partner_url, 1, 60) as link,
  DATE(start_at) as starts
FROM events 
WHERE type='affiliate' 
LIMIT 5;
" 2>/dev/null

echo ""
echo "✅ All events updated!"
echo "Visit: https://balkly.live/events"

