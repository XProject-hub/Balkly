#!/bin/bash
cd /var/www/balkly

echo "Cleaning duplicate attributes..."

# Get auto category ID
AUTO_ID=$(docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -sN -e "SELECT id FROM categories WHERE slug='auto';" 2>/dev/null)

echo "Auto category ID: $AUTO_ID"

# Delete ALL attributes for auto category
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
DELETE FROM attributes WHERE category_id = $AUTO_ID;
" 2>/dev/null

echo "Deleted old attributes"

# Add fresh attributes (one time only)
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
INSERT INTO attributes (category_id, name, slug, type, options_json, is_required, is_searchable, \`order\`, created_at, updated_at) VALUES
($AUTO_ID, 'Brand', 'brand', 'select', '[\"Toyota\",\"BMW\",\"Mercedes-Benz\",\"Audi\",\"Volkswagen\",\"Ford\",\"Honda\",\"Nissan\",\"Hyundai\",\"Kia\",\"Mazda\",\"Chevrolet\",\"Tesla\",\"Lexus\",\"Porsche\",\"Ferrari\",\"Lamborghini\",\"Jeep\",\"Land Rover\",\"Volvo\",\"Renault\",\"Peugeot\",\"Fiat\",\"Alfa Romeo\",\"Jaguar\",\"Bentley\",\"Rolls-Royce\",\"McLaren\",\"Aston Martin\",\"Maserati\",\"Dodge\",\"Chrysler\",\"Cadillac\",\"Buick\",\"GMC\",\"Ram\",\"Mitsubishi\",\"Subaru\",\"Suzuki\",\"Infiniti\",\"Acura\",\"Genesis\",\"Skoda\",\"Seat\",\"Opel\",\"Mini\",\"Smart\"]', 1, 1, 1, NOW(), NOW()),
($AUTO_ID, 'Model', 'model', 'text', NULL, 1, 1, 2, NOW(), NOW()),
($AUTO_ID, 'Year', 'year', 'number', NULL, 1, 1, 3, NOW(), NOW()),
($AUTO_ID, 'Mileage (km)', 'mileage', 'number', NULL, 0, 1, 4, NOW(), NOW()),
($AUTO_ID, 'Fuel Type', 'fuel_type', 'select', '[\"Petrol\",\"Diesel\",\"Electric\",\"Hybrid\",\"Plug-in Hybrid\"]', 1, 1, 5, NOW(), NOW()),
($AUTO_ID, 'Body Type', 'body_type', 'select', '[\"Sedan\",\"Hatchback\",\"SUV\",\"Coupe\",\"Convertible\",\"Wagon\",\"Van\",\"Pickup Truck\",\"Minivan\",\"Limousine\",\"Crossover\",\"Sports Car\",\"Luxury Car\"]', 0, 1, 6, NOW(), NOW()),
($AUTO_ID, 'Transmission', 'transmission', 'select', '[\"Automatic\",\"Manual\",\"Semi-Automatic\"]', 0, 1, 7, NOW(), NOW()),
($AUTO_ID, 'Color', 'color', 'select', '[\"Black\",\"White\",\"Silver\",\"Gray\",\"Red\",\"Blue\",\"Green\",\"Yellow\",\"Orange\",\"Brown\",\"Gold\",\"Beige\",\"Other\"]', 0, 1, 8, NOW(), NOW()),
($AUTO_ID, 'Condition', 'condition', 'select', '[\"New\",\"Like New\",\"Good\",\"Fair\",\"Used\"]', 1, 1, 9, NOW(), NOW());
" 2>/dev/null

echo "✅ Clean attributes added!"
echo ""
echo "Auto category now has:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
SELECT name, slug FROM attributes WHERE category_id = $AUTO_ID ORDER BY \`order\`;
" 2>/dev/null

