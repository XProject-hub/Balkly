#!/bin/bash
cd /var/www/balkly

echo "=========================================="
echo "🚀 COMPLETE DEPLOYMENT"
echo "=========================================="
echo ""

# 1. Pull latest
echo "📥 Pulling latest code..."
git pull origin main
echo ""

# 2. Stop all
echo "⏹️  Stopping services..."
docker-compose down
echo ""

# 3. Clean containers
echo "🧹 Cleaning old containers..."
docker container prune -f
echo ""

# 4. Start fresh
echo "▶️  Starting services..."
docker-compose up -d
sleep 15
echo ""

# 5. Migrations
echo "📊 Running migrations..."
docker exec balkly_api php artisan migrate --force
echo ""

# 6. Clear caches
echo "🗑️  Clearing caches..."
docker exec balkly_api php artisan cache:clear
docker exec balkly_api php artisan config:clear
docker exec balkly_api php artisan route:clear
docker exec balkly_web rm -rf .next 2>/dev/null || true
echo ""

# 7. Fix attributes
echo "🔧 Fixing duplicate attributes..."
AUTO_ID=$(docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -sN -e "SELECT id FROM categories WHERE slug='auto';" 2>/dev/null)
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "DELETE FROM attributes WHERE category_id = $AUTO_ID;" 2>/dev/null

docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
INSERT INTO attributes (category_id, name, slug, type, options_json, is_required, is_searchable, \`order\`, created_at, updated_at) VALUES
($AUTO_ID, 'Brand', 'brand', 'select', '[\"Acura\",\"Alfa Romeo\",\"Aston Martin\",\"Audi\",\"Bentley\",\"BMW\",\"Bugatti\",\"Buick\",\"Cadillac\",\"Chevrolet\",\"Chrysler\",\"Citroën\",\"Dacia\",\"Dodge\",\"Ferrari\",\"Fiat\",\"Ford\",\"Genesis\",\"GMC\",\"Honda\",\"Hyundai\",\"Infiniti\",\"Isuzu\",\"Jaguar\",\"Jeep\",\"Kia\",\"Lamborghini\",\"Lancia\",\"Land Rover\",\"Lexus\",\"Lincoln\",\"Maserati\",\"Mazda\",\"McLaren\",\"Mercedes-Benz\",\"Mini\",\"Mitsubishi\",\"Nissan\",\"Opel\",\"Peugeot\",\"Porsche\",\"Ram\",\"Renault\",\"Rolls-Royce\",\"Saab\",\"Seat\",\"Skoda\",\"Smart\",\"Subaru\",\"Suzuki\",\"Tesla\",\"Toyota\",\"Volkswagen\",\"Volvo\"]', 1, 1, 1, NOW(), NOW()),
($AUTO_ID, 'Model', 'model', 'text', NULL, 1, 1, 2, NOW(), NOW()),
($AUTO_ID, 'Year', 'year', 'number', NULL, 1, 1, 3, NOW(), NOW()),
($AUTO_ID, 'Mileage (km)', 'mileage', 'number', NULL, 0, 1, 4, NOW(), NOW()),
($AUTO_ID, 'Fuel Type', 'fuel_type', 'select', '[\"Petrol\",\"Diesel\",\"Electric\",\"Hybrid\"]', 1, 1, 5, NOW(), NOW()),
($AUTO_ID, 'Body Type', 'body_type', 'select', '[\"Sedan\",\"Hatchback\",\"SUV\",\"Coupe\",\"Convertible\",\"Wagon\",\"Van\",\"Pickup Truck\",\"Minivan\",\"Limousine\",\"Crossover\",\"Sports Car\",\"Luxury Car\"]', 0, 1, 6, NOW(), NOW()),
($AUTO_ID, 'Transmission', 'transmission', 'select', '[\"Automatic\",\"Manual\",\"Semi-Automatic\"]', 0, 1, 7, NOW(), NOW()),
($AUTO_ID, 'Color', 'color', 'select', '[\"Black\",\"White\",\"Silver\",\"Gray\",\"Red\",\"Blue\",\"Green\",\"Yellow\",\"Orange\",\"Brown\",\"Gold\",\"Beige\",\"Other\"]', 0, 1, 8, NOW(), NOW()),
($AUTO_ID, 'Condition', 'condition', 'select', '[\"New\",\"Like New\",\"Good\",\"Fair\",\"Used\"]', 1, 1, 9, NOW(), NOW());
" 2>/dev/null
echo "✓ Attributes fixed"
echo ""

# 8. Add sports
SPORTS_ID=$(docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -sN -e "SELECT id FROM categories WHERE slug='sports';" 2>/dev/null)
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
INSERT INTO attributes (category_id, name, slug, type, options_json, is_required, is_searchable, \`order\`, created_at, updated_at)
VALUES ($SPORTS_ID, 'Sport Type', 'sport_type', 'select',
  '[\"American Football\",\"Archery\",\"Badminton\",\"Baseball\",\"Basketball\",\"Boxing\",\"Cricket\",\"Cycling\",\"Diving\",\"Fishing\",\"Football / Soccer\",\"Golf\",\"Gym Equipment\",\"Handball\",\"Hiking\",\"Ice Hockey\",\"Judo\",\"Karate\",\"Kayaking\",\"Kickboxing\",\"MMA\",\"Padel\",\"Rock Climbing\",\"Rugby\",\"Running\",\"Sailing\",\"Skateboarding\",\"Skiing\",\"Snowboarding\",\"Squash\",\"Surfing\",\"Swimming\",\"Table Tennis\",\"Taekwondo\",\"Tennis\",\"Volleyball\",\"Water Polo\",\"Weightlifting\",\"Wrestling\",\"Yoga\"]',
  1, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE options_json=VALUES(options_json);
" 2>/dev/null
echo "✓ Sports added"
echo ""

# 9. Restart all
echo "🔄 Final restart..."
docker-compose restart api web
sleep 5

# 10. Start API server
echo "🚀 Starting API server..."
docker exec -d balkly_api bash -c "php artisan serve --host=0.0.0.0 --port=8000"
sleep 3

# 11. Test
echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
docker-compose ps
echo ""
echo "🌐 Visit: https://balkly.live"
echo ""

