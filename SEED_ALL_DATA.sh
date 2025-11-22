#!/bin/bash
cd /var/www/balkly

echo "Seeding all data..."

# Categories
docker exec balkly_api php artisan db:seed --class=CategorySeeder --force

# Forum categories
docker exec balkly_api php artisan db:seed --class=ForumCategoriesSeeder --force

# Plans
docker exec balkly_api php artisan db:seed --class=PlanSeeder --force

# Events (Platinumlist)
docker exec balkly_api php artisan platinumlist:fetch

echo "✅ All data seeded!"

