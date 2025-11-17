<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ForumCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'id' => 1,
                'name' => 'General Discussion',
                'slug' => 'general',
                'description' => 'General topics and community discussions',
                'icon' => '💬',
                'order' => 1,
                'subcategories' => [
                    ['name' => 'Announcements', 'slug' => 'announcements', 'description' => 'Official announcements and updates'],
                    ['name' => 'Help & Support', 'slug' => 'help-support', 'description' => 'Get help from the community'],
                    ['name' => 'Feedback & Suggestions', 'slug' => 'feedback', 'description' => 'Share your feedback'],
                ]
            ],
            [
                'id' => 2,
                'name' => 'Marketplace',
                'slug' => 'marketplace',
                'description' => 'Buy, sell, and trade items',
                'icon' => '🛍️',
                'order' => 2,
                'subcategories' => [
                    ['name' => 'Buy & Sell', 'slug' => 'buy-sell', 'description' => 'General buying and selling'],
                    ['name' => 'Price Negotiation', 'slug' => 'price-negotiation', 'description' => 'Discuss pricing and deals'],
                    ['name' => 'Trade & Barter', 'slug' => 'trade-barter', 'description' => 'Exchange items'],
                ]
            ],
            [
                'id' => 3,
                'name' => 'Auto & Transport',
                'slug' => 'auto',
                'description' => 'Cars, motorcycles, and vehicles',
                'icon' => '🚗',
                'order' => 3,
                'subcategories' => [
                    ['name' => 'Cars', 'slug' => 'cars', 'description' => 'Car discussions and sales'],
                    ['name' => 'Motorcycles', 'slug' => 'motorcycles', 'description' => 'Motorcycle community'],
                    ['name' => 'Auto Parts', 'slug' => 'auto-parts', 'description' => 'Parts and accessories'],
                    ['name' => 'Maintenance Tips', 'slug' => 'maintenance', 'description' => 'Car care and maintenance'],
                ]
            ],
            [
                'id' => 4,
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Phones, computers, and gadgets',
                'icon' => '📱',
                'order' => 4,
                'subcategories' => [
                    ['name' => 'Mobile Phones', 'slug' => 'phones', 'description' => 'Smartphones and tablets'],
                    ['name' => 'Computers', 'slug' => 'computers', 'description' => 'Laptops and desktops'],
                    ['name' => 'Gaming', 'slug' => 'gaming', 'description' => 'Gaming consoles and accessories'],
                    ['name' => 'Tech Support', 'slug' => 'tech-support', 'description' => 'Technical help'],
                ]
            ],
            [
                'id' => 5,
                'name' => 'Real Estate',
                'slug' => 'real-estate',
                'description' => 'Properties for rent and sale',
                'icon' => '🏠',
                'order' => 5,
                'subcategories' => [
                    ['name' => 'For Rent', 'slug' => 'for-rent', 'description' => 'Rental properties'],
                    ['name' => 'For Sale', 'slug' => 'for-sale', 'description' => 'Properties for sale'],
                    ['name' => 'Roommates', 'slug' => 'roommates', 'description' => 'Find roommates'],
                    ['name' => 'Real Estate Advice', 'slug' => 'advice', 'description' => 'Property advice'],
                ]
            ],
            [
                'id' => 6,
                'name' => 'Jobs',
                'slug' => 'jobs',
                'description' => 'Job listings and career discussions',
                'icon' => '💼',
                'order' => 6,
                'subcategories' => [
                    ['name' => 'Job Offers', 'slug' => 'job-offers', 'description' => 'Available positions'],
                    ['name' => 'Job Seekers', 'slug' => 'job-seekers', 'description' => 'Looking for work'],
                    ['name' => 'Freelance', 'slug' => 'freelance', 'description' => 'Freelance opportunities'],
                    ['name' => 'Career Advice', 'slug' => 'career-advice', 'description' => 'Career guidance'],
                ]
            ],
            [
                'id' => 7,
                'name' => 'Services',
                'slug' => 'services',
                'description' => 'Professional services',
                'icon' => '🔧',
                'order' => 7,
                'subcategories' => [
                    ['name' => 'Home Services', 'slug' => 'home-services', 'description' => 'Plumbing, electrical, etc.'],
                    ['name' => 'Professional Services', 'slug' => 'professional', 'description' => 'Accounting, legal, etc.'],
                    ['name' => 'Events & Entertainment', 'slug' => 'events', 'description' => 'Event services'],
                ]
            ],
            [
                'id' => 8,
                'name' => 'Fashion & Beauty',
                'slug' => 'fashion',
                'description' => 'Clothing, accessories, and beauty',
                'icon' => '👗',
                'order' => 8,
                'subcategories' => [
                    ['name' => 'Clothing', 'slug' => 'clothing', 'description' => 'Men and women clothing'],
                    ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Bags, watches, jewelry'],
                    ['name' => 'Beauty & Health', 'slug' => 'beauty', 'description' => 'Beauty products'],
                ]
            ],
            [
                'id' => 9,
                'name' => 'Home & Garden',
                'slug' => 'home-garden',
                'description' => 'Furniture, decor, and gardening',
                'icon' => '🪴',
                'order' => 9,
                'subcategories' => [
                    ['name' => 'Furniture', 'slug' => 'furniture', 'description' => 'Home furniture'],
                    ['name' => 'Home Decor', 'slug' => 'decor', 'description' => 'Decoration items'],
                    ['name' => 'Garden & Outdoor', 'slug' => 'garden', 'description' => 'Gardening supplies'],
                ]
            ],
            [
                'id' => 10,
                'name' => 'Sports & Hobbies',
                'slug' => 'sports',
                'description' => 'Sports equipment and hobbies',
                'icon' => '⚽',
                'order' => 10,
                'subcategories' => [
                    ['name' => 'Sports Equipment', 'slug' => 'sports-equipment', 'description' => 'Sports gear'],
                    ['name' => 'Fitness', 'slug' => 'fitness', 'description' => 'Gym and fitness'],
                    ['name' => 'Hobbies & Crafts', 'slug' => 'hobbies', 'description' => 'Hobby supplies'],
                ]
            ],
        ];

        foreach ($categories as $category) {
            $subcategories = $category['subcategories'];
            unset($category['subcategories']);
            
            DB::table('forum_categories')->insert($category);

            foreach ($subcategories as $sub) {
                DB::table('forum_subcategories')->insert([
                    'forum_category_id' => $category['id'],
                    'name' => $sub['name'],
                    'slug' => $sub['slug'],
                    'description' => $sub['description'],
                ]);
            }
        }
    }
}

