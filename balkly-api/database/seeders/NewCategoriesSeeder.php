<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Attribute;
use Illuminate\Database\Seeder;

class NewCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'slug'        => 'beauty',
                'name'        => 'Beauty & Cosmetics',
                'icon'        => 'sparkles',
                'description' => 'Cosmetics, skincare, haircare, and personal care',
                'order'       => 10,
                'attributes'  => [
                    ['name' => 'Category',  'slug' => 'beauty_category',  'type' => 'select',
                     'options' => ['Skincare', 'Makeup', 'Haircare', 'Perfume & Fragrance', 'Nail Care', 'Body Care', 'Oral Care', 'Men\'s Grooming', 'Tools & Accessories']],
                    ['name' => 'Brand',     'slug' => 'beauty_brand',     'type' => 'text'],
                    ['name' => 'Condition', 'slug' => 'beauty_condition', 'type' => 'select',
                     'options' => ['New', 'Like New', 'Used']],
                ],
            ],
            [
                'slug'        => 'home-garden',
                'name'        => 'Home & Garden',
                'icon'        => 'sofa',
                'description' => 'Furniture, home decor, garden, and household items',
                'order'       => 11,
                'attributes'  => [
                    ['name' => 'Category',  'slug' => 'home_category',  'type' => 'select',
                     'options' => ['Furniture', 'Lighting', 'Kitchen & Dining', 'Bedding & Bath', 'Garden & Outdoor', 'Storage & Organisation', 'Home Decor', 'Appliances', 'DIY & Tools']],
                    ['name' => 'Condition', 'slug' => 'home_condition', 'type' => 'select',
                     'options' => ['New', 'Like New', 'Good', 'Fair', 'Used']],
                ],
            ],
            [
                'slug'        => 'baby-kids',
                'name'        => 'Baby & Kids',
                'icon'        => 'baby',
                'description' => 'Toys, clothing, and items for babies and children',
                'order'       => 12,
                'attributes'  => [
                    ['name' => 'Category',  'slug' => 'baby_category',  'type' => 'select',
                     'options' => ['Toys & Games', 'Clothing & Shoes', 'Strollers & Prams', 'Car Seats', 'Baby Gear', 'Nursery Furniture', 'Books & Educational', 'School Supplies']],
                    ['name' => 'Age Group', 'slug' => 'age_group',      'type' => 'select',
                     'options' => ['0-12 months', '1-3 years', '3-6 years', '6-12 years', '12+ years']],
                    ['name' => 'Condition', 'slug' => 'baby_condition', 'type' => 'select',
                     'options' => ['New', 'Like New', 'Good', 'Used']],
                ],
            ],
            [
                'slug'        => 'health',
                'name'        => 'Health & Wellness',
                'icon'        => 'heart-pulse',
                'description' => 'Health equipment, supplements, and wellness products',
                'order'       => 13,
                'attributes'  => [
                    ['name' => 'Category',  'slug' => 'health_category', 'type' => 'select',
                     'options' => ['Medical Equipment', 'Supplements & Vitamins', 'Fitness Equipment', 'Mobility Aids', 'Vision & Eye Care', 'First Aid', 'Mental Wellness', 'Other']],
                    ['name' => 'Condition', 'slug' => 'health_condition', 'type' => 'select',
                     'options' => ['New', 'Like New', 'Used']],
                ],
            ],
        ];

        foreach ($categories as $cat) {
            $attributes = $cat['attributes'] ?? [];
            unset($cat['attributes']);

            $category = Category::firstOrCreate(
                ['slug' => $cat['slug']],
                array_merge($cat, ['is_active' => true])
            );

            foreach ($attributes as $i => $attr) {
                $options = $attr['options'] ?? null;
                unset($attr['options']);

                Attribute::firstOrCreate(
                    ['category_id' => $category->id, 'slug' => $attr['slug']],
                    array_merge($attr, [
                        'category_id'   => $category->id,
                        'options_json'  => $options,
                        'is_required'   => $i === 0,
                        'is_searchable' => true,
                        'order'         => $i + 1,
                    ])
                );
            }
        }

        $this->command->info('New categories seeded: beauty, home-garden, baby-kids, health');
    }
}
