<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Category;
use Illuminate\Database\Seeder;

class UpdatedPlanSeeder extends Seeder
{
    public function run(): void
    {
        // Delete old plans
        Plan::truncate();

        $autoCategory = Category::where('slug', 'auto')->first();
        $realEstateCategory = Category::where('slug', 'real-estate')->first();

        // PROMOTION PLANS (Listings are FREE to post, PAY only for promotion)
        $promotionPlans = [
            ['days' => 3, 'price' => 5.00],
            ['days' => 5, 'price' => 8.00],
            ['days' => 7, 'price' => 12.00],
            ['days' => 10, 'price' => 15.00],
            ['days' => 30, 'price' => 35.00],
        ];

        foreach ($promotionPlans as $plan) {
            // Auto category promotions
            Plan::create([
                'category_id' => $autoCategory->id,
                'name' => "Promote {$plan['days']} Days",
                'slug' => "auto-promote-{$plan['days']}d",
                'price' => $plan['price'],
                'currency' => 'EUR',
                'duration_days' => $plan['days'],
                'perks_json' => ['Featured placement', 'Top of category', "{$plan['days']} days visibility"],
                'type' => 'boost',
                'is_active' => true,
            ]);

            // Real Estate category promotions
            Plan::create([
                'category_id' => $realEstateCategory->id,
                'name' => "Promote {$plan['days']} Days",
                'slug' => "realestate-promote-{$plan['days']}d",
                'price' => $plan['price'],
                'currency' => 'EUR',
                'duration_days' => $plan['days'],
                'perks_json' => ['Featured placement', 'Top of category', "{$plan['days']} days visibility"],
                'type' => 'boost',
                'is_active' => true,
            ]);
        }

        // FORUM STICKY PLANS (Forum posts are FREE, PAY to sticky)
        foreach ($promotionPlans as $plan) {
            Plan::create([
                'category_id' => null,
                'name' => "Forum Sticky {$plan['days']} Days",
                'slug' => "forum-sticky-{$plan['days']}d",
                'price' => $plan['price'],
                'currency' => 'EUR',
                'duration_days' => $plan['days'],
                'perks_json' => ["Pinned to top for {$plan['days']} days"],
                'type' => 'sticky',
                'is_active' => true,
            ]);
        }
    }
}

