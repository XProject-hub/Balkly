<?php

namespace Database\Seeders;

use App\Models\ForumCategory;
use Illuminate\Database\Seeder;

class ForumCategorySeeder extends Seeder
{
    public function run(): void
    {
        ForumCategory::create([
            'name' => 'General Discussion',
            'slug' => 'general',
            'description' => 'General topics and discussions',
            'icon' => 'message-circle',
            'order' => 1,
            'is_active' => true,
        ]);

        ForumCategory::create([
            'name' => 'Buy & Sell',
            'slug' => 'buy-sell',
            'description' => 'Trade, buy and sell items',
            'icon' => 'shopping-bag',
            'order' => 2,
            'is_active' => true,
        ]);

        ForumCategory::create([
            'name' => 'Auto & Vehicles',
            'slug' => 'auto-vehicles',
            'description' => 'Discussions about cars and vehicles',
            'icon' => 'car',
            'order' => 3,
            'is_active' => true,
        ]);

        ForumCategory::create([
            'name' => 'Real Estate',
            'slug' => 'real-estate',
            'description' => 'Property discussions and advice',
            'icon' => 'home',
            'order' => 4,
            'is_active' => true,
        ]);

        ForumCategory::create([
            'name' => 'Events & Entertainment',
            'slug' => 'events',
            'description' => 'Talk about upcoming events',
            'icon' => 'calendar',
            'order' => 5,
            'is_active' => true,
        ]);

        ForumCategory::create([
            'name' => 'Help & Support',
            'slug' => 'help-support',
            'description' => 'Get help and support',
            'icon' => 'help-circle',
            'order' => 6,
            'is_active' => true,
        ]);
    }
}

