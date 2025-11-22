#!/bin/bash
cd /var/www/balkly

echo "Fixing forum categories..."

# Seed forum categories again
docker exec balkly_api php artisan db:seed --class=ForumCategoriesSeeder --force

echo ""
echo "Forum categories seeded!"
echo ""
echo "Categories:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "SELECT id, name, slug FROM forum_categories ORDER BY \`order\`;" 2>/dev/null

echo ""
echo "Subcategories:"
docker exec balkly_mysql mysql -u balkly -pbalkly_pass balkly -e "SELECT id, forum_category_id, name, slug FROM forum_subcategories LIMIT 20;" 2>/dev/null

echo ""
echo "✅ Forum should work now!"

