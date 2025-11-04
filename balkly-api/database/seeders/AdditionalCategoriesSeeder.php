<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class AdditionalCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'slug' => 'electronics',
                'name' => 'Electronics',
                'icon' => 'smartphone',
                'description' => 'Phones, computers, and gadgets',
                'order' => 4,
            ],
            [
                'slug' => 'fashion',
                'name' => 'Fashion & Clothing',
                'icon' => 'shirt',
                'description' => 'Clothing, shoes, and accessories',
                'order' => 5,
            ],
            [
                'slug' => 'furniture',
                'name' => 'Furniture & Home',
                'icon' => 'sofa',
                'description' => 'Furniture and home decor',
                'order' => 6,
            ],
            [
                'slug' => 'sports',
                'name' => 'Sports & Outdoor',
                'icon' => 'dumbbell',
                'description' => 'Sports equipment and outdoor gear',
                'order' => 7,
            ],
            [
                'slug' => 'jobs',
                'name' => 'Jobs',
                'icon' => 'briefcase',
                'description' => 'Job listings and opportunities',
                'order' => 8,
            ],
            [
                'slug' => 'services',
                'name' => 'Services',
                'icon' => 'wrench',
                'description' => 'Professional services',
                'order' => 9,
            ],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => $cat['slug']],
                $cat
            );
        }
    }
}

