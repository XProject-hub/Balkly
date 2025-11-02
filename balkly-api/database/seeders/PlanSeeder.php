<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Category;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $autoCategory = Category::where('slug', 'auto')->first();
        $realEstateCategory = Category::where('slug', 'real-estate')->first();

        // Auto Plans
        Plan::create([
            'category_id' => $autoCategory->id,
            'name' => 'Standard',
            'slug' => 'auto-standard',
            'price' => 4.99,
            'currency' => 'EUR',
            'duration_days' => 30,
            'perks_json' => ['Basic listing', '30 days visibility'],
            'type' => 'listing',
            'is_active' => true,
        ]);

        Plan::create([
            'category_id' => $autoCategory->id,
            'name' => 'Featured',
            'slug' => 'auto-featured',
            'price' => 14.99,
            'currency' => 'EUR',
            'duration_days' => 30,
            'perks_json' => ['Featured on homepage', 'Top of category', '30 days visibility'],
            'type' => 'listing',
            'is_active' => true,
        ]);

        Plan::create([
            'category_id' => $autoCategory->id,
            'name' => 'Boost (7 days)',
            'slug' => 'auto-boost-7',
            'price' => 4.99,
            'currency' => 'EUR',
            'duration_days' => 7,
            'perks_json' => ['Top placement for 7 days'],
            'type' => 'boost',
            'is_active' => true,
        ]);

        // Real Estate Plans
        Plan::create([
            'category_id' => $realEstateCategory->id,
            'name' => 'Standard',
            'slug' => 'realestate-standard',
            'price' => 9.99,
            'currency' => 'EUR',
            'duration_days' => 30,
            'perks_json' => ['Basic listing', '30 days visibility'],
            'type' => 'listing',
            'is_active' => true,
        ]);

        Plan::create([
            'category_id' => $realEstateCategory->id,
            'name' => 'Featured',
            'slug' => 'realestate-featured',
            'price' => 25.99,
            'currency' => 'EUR',
            'duration_days' => 30,
            'perks_json' => ['Featured on homepage', 'Top of category', '30 days visibility'],
            'type' => 'listing',
            'is_active' => true,
        ]);

        // Forum Sticky Plans
        Plan::create([
            'category_id' => null,
            'name' => 'Forum Sticky (7 days)',
            'slug' => 'forum-sticky-7',
            'price' => 2.99,
            'currency' => 'EUR',
            'duration_days' => 7,
            'perks_json' => ['Pinned to top for 7 days'],
            'type' => 'sticky',
            'is_active' => true,
        ]);

        Plan::create([
            'category_id' => null,
            'name' => 'Forum Sticky (30 days)',
            'slug' => 'forum-sticky-30',
            'price' => 9.99,
            'currency' => 'EUR',
            'duration_days' => 30,
            'perks_json' => ['Pinned to top for 30 days'],
            'type' => 'sticky',
            'is_active' => true,
        ]);
    }
}

