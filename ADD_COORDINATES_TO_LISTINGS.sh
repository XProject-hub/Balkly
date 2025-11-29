#!/bin/bash
cd /var/www/balkly

echo "Adding coordinates to listings..."

# Update listings with coordinates based on city
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
-- Dubai
UPDATE listings SET latitude = 25.2048, longitude = 55.2708 WHERE city LIKE '%Dubai%' OR city LIKE '%dubai%';

-- Abu Dhabi
UPDATE listings SET latitude = 24.4539, longitude = 54.3773 WHERE city LIKE '%Abu Dhabi%' OR city LIKE '%Abu%';

-- Sharjah
UPDATE listings SET latitude = 25.3573, longitude = 55.3909 WHERE city LIKE '%Sharjah%';

-- Ajman
UPDATE listings SET latitude = 25.4052, longitude = 55.5137 WHERE city LIKE '%Ajman%';

-- Ras Al Khaimah
UPDATE listings SET latitude = 25.7896, longitude = 55.9434 WHERE city LIKE '%Ras%';

-- Fujairah
UPDATE listings SET latitude = 25.1288, longitude = 56.3265 WHERE city LIKE '%Fujairah%';

-- Umm Al Quwain
UPDATE listings SET latitude = 25.5647, longitude = 55.5553 WHERE city LIKE '%Umm%';

-- Default to Dubai if city is AE but no match
UPDATE listings SET latitude = 25.2048, longitude = 55.2708 WHERE country = 'AE' AND latitude IS NULL;
" 2>/dev/null

echo ""
echo "✅ Coordinates added!"
echo ""
echo "Listings with coordinates:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT COUNT(*) as with_coords FROM listings WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
SELECT city, latitude, longitude FROM listings WHERE latitude IS NOT NULL LIMIT 10;
" 2>/dev/null

