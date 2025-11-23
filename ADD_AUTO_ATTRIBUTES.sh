#!/bin/bash
cd /var/www/balkly

echo "Adding Auto attributes..."

# Add Body Type
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
INSERT INTO attributes (category_id, name, slug, type, options_json, is_required, is_searchable, \`order\`, created_at, updated_at)
SELECT id, 'Body Type', 'body_type', 'select',
  '[\"Sedan\",\"Hatchback\",\"SUV\",\"Coupe\",\"Convertible\",\"Wagon\",\"Van\",\"Pickup Truck\",\"Minivan\",\"Limousine\",\"Crossover\",\"Sports Car\",\"Luxury Car\"]',
  0, 1, 6, NOW(), NOW()
FROM categories WHERE slug = 'auto'
ON DUPLICATE KEY UPDATE 
  options_json='[\"Sedan\",\"Hatchback\",\"SUV\",\"Coupe\",\"Convertible\",\"Wagon\",\"Van\",\"Pickup Truck\",\"Minivan\",\"Limousine\",\"Crossover\",\"Sports Car\",\"Luxury Car\"]',
  updated_at=NOW();
" 2>/dev/null

# Add Transmission
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
INSERT INTO attributes (category_id, name, slug, type, options_json, is_required, is_searchable, \`order\`, created_at, updated_at)
SELECT id, 'Transmission', 'transmission', 'select',
  '[\"Automatic\",\"Manual\",\"Semi-Automatic\"]',
  0, 1, 7, NOW(), NOW()
FROM categories WHERE slug = 'auto'
ON DUPLICATE KEY UPDATE 
  options_json='[\"Automatic\",\"Manual\",\"Semi-Automatic\"]',
  updated_at=NOW();
" 2>/dev/null

# Add Color
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
INSERT INTO attributes (category_id, name, slug, type, options_json, is_required, is_searchable, \`order\`, created_at, updated_at)
SELECT id, 'Color', 'color', 'select',
  '[\"Black\",\"White\",\"Silver\",\"Gray\",\"Red\",\"Blue\",\"Green\",\"Yellow\",\"Orange\",\"Brown\",\"Gold\",\"Beige\",\"Other\"]',
  0, 1, 8, NOW(), NOW()
FROM categories WHERE slug = 'auto'
ON DUPLICATE KEY UPDATE 
  options_json='[\"Black\",\"White\",\"Silver\",\"Gray\",\"Red\",\"Blue\",\"Green\",\"Yellow\",\"Orange\",\"Brown\",\"Gold\",\"Beige\",\"Other\"]',
  updated_at=NOW();
" 2>/dev/null

echo "✅ Body Type, Transmission, Color added!"
echo ""
echo "Body types include: Limousine ✅"

