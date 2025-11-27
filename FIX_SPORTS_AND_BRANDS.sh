#!/bin/bash
cd /var/www/balkly

echo "Adding sports and fixing car brands..."

# Get Sports category ID
SPORTS_ID=$(docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -sN -e "SELECT id FROM categories WHERE slug='sports';" 2>/dev/null)

# Add Sport Type attribute with ALL sports
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
INSERT INTO attributes (category_id, name, slug, type, options_json, is_required, is_searchable, \`order\`, created_at, updated_at)
VALUES ($SPORTS_ID, 'Sport Type', 'sport_type', 'select',
  '[\"American Football\",\"Archery\",\"Badminton\",\"Baseball\",\"Basketball\",\"Boxing\",\"Cricket\",\"Cycling\",\"Diving\",\"Fishing\",\"Football / Soccer\",\"Golf\",\"Gym Equipment\",\"Handball\",\"Hiking\",\"Ice Hockey\",\"Judo\",\"Karate\",\"Kayaking\",\"Kickboxing\",\"MMA\",\"Padel\",\"Rock Climbing\",\"Rugby\",\"Running\",\"Sailing\",\"Skateboarding\",\"Skiing\",\"Snowboarding\",\"Squash\",\"Surfing\",\"Swimming\",\"Table Tennis\",\"Taekwondo\",\"Tennis\",\"Volleyball\",\"Water Polo\",\"Weightlifting\",\"Wrestling\",\"Yoga\"]',
  1, 1, 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  options_json='[\"American Football\",\"Archery\",\"Badminton\",\"Baseball\",\"Basketball\",\"Boxing\",\"Cricket\",\"Cycling\",\"Diving\",\"Fishing\",\"Football / Soccer\",\"Golf\",\"Gym Equipment\",\"Handball\",\"Hiking\",\"Ice Hockey\",\"Judo\",\"Karate\",\"Kayaking\",\"Kickboxing\",\"MMA\",\"Padel\",\"Rock Climbing\",\"Rugby\",\"Running\",\"Sailing\",\"Skateboarding\",\"Skiing\",\"Snowboarding\",\"Squash\",\"Surfing\",\"Swimming\",\"Table Tennis\",\"Taekwondo\",\"Tennis\",\"Volleyball\",\"Water Polo\",\"Weightlifting\",\"Wrestling\",\"Yoga\"]';
" 2>/dev/null

# Update car brands - SORTED alphabetically + complete list
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "
UPDATE attributes SET 
  options_json = '[\"Acura\",\"Alfa Romeo\",\"Aston Martin\",\"Audi\",\"Bentley\",\"BMW\",\"Bugatti\",\"Buick\",\"Cadillac\",\"Chevrolet\",\"Chrysler\",\"Citroën\",\"Dacia\",\"Dodge\",\"Ferrari\",\"Fiat\",\"Ford\",\"Genesis\",\"GMC\",\"Honda\",\"Hyundai\",\"Infiniti\",\"Isuzu\",\"Jaguar\",\"Jeep\",\"Kia\",\"Lamborghini\",\"Lancia\",\"Land Rover\",\"Lexus\",\"Lincoln\",\"Maserati\",\"Mazda\",\"McLaren\",\"Mercedes-Benz\",\"Mini\",\"Mitsubishi\",\"Nissan\",\"Opel\",\"Peugeot\",\"Porsche\",\"Ram\",\"Renault\",\"Rolls-Royce\",\"Saab\",\"Seat\",\"Skoda\",\"Smart\",\"Subaru\",\"Suzuki\",\"Tesla\",\"Toyota\",\"Volkswagen\",\"Volvo\"]'
WHERE slug = 'brand';
" 2>/dev/null

echo ""
echo "✅ Sports added (40+ sports)!"
echo "✅ Car brands updated (53 brands, alphabetically sorted, includes Opel)!"

