<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumCategory;

class ForumSubcategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing main categories
        $general = ForumCategory::where('slug', 'general')->first();
        $buySell = ForumCategory::where('slug', 'buy-sell')->first();
        $auto = ForumCategory::where('slug', 'auto-vehicles')->first();
        $realEstate = ForumCategory::where('slug', 'real-estate')->first();
        $events = ForumCategory::where('slug', 'events-entertainment')->first();

        // Add subcategories for General Discussion
        if ($general) {
            ForumCategory::firstOrCreate([
                'slug' => 'introductions',
            ], [
                'parent_id' => $general->id,
                'name' => 'Introductions',
                'description' => 'Introduce yourself to the community',
                'order' => 100,
                'is_active' => true,
            ]);

            ForumCategory::firstOrCreate([
                'slug' => 'off-topic',
            ], [
                'parent_id' => $general->id,
                'name' => 'Off-Topic',
                'description' => 'General chat and discussions',
                'order' => 101,
                'is_active' => true,
            ]);
        }

        // Add subcategories for Buy & Sell
        if ($buySell) {
            ForumCategory::firstOrCreate([
                'slug' => 'selling-tips',
            ], [
                'parent_id' => $buySell->id,
                'name' => 'Selling Tips',
                'description' => 'Tips and tricks for successful selling',
                'order' => 200,
                'is_active' => true,
            ]);

            ForumCategory::firstOrCreate([
                'slug' => 'price-check',
            ], [
                'parent_id' => $buySell->id,
                'name' => 'Price Check',
                'description' => 'Ask about fair pricing for items',
                'order' => 201,
                'is_active' => true,
            ]);
        }

        // Add subcategories for Auto & Vehicles
        if ($auto) {
            ForumCategory::firstOrCreate([
                'slug' => 'cars',
            ], [
                'parent_id' => $auto->id,
                'name' => 'Cars',
                'description' => 'Car discussions and advice',
                'order' => 300,
                'is_active' => true,
            ]);

            ForumCategory::firstOrCreate([
                'slug' => 'motorcycles',
            ], [
                'parent_id' => $auto->id,
                'name' => 'Motorcycles',
                'description' => 'Motorcycle discussions',
                'order' => 301,
                'is_active' => true,
            ]);

            ForumCategory::firstOrCreate([
                'slug' => 'maintenance',
            ], [
                'parent_id' => $auto->id,
                'name' => 'Maintenance & Repairs',
                'description' => 'Car care and repair tips',
                'order' => 302,
                'is_active' => true,
            ]);
        }

        // Add subcategories for Real Estate
        if ($realEstate) {
            ForumCategory::firstOrCreate([
                'slug' => 'apartments',
            ], [
                'parent_id' => $realEstate->id,
                'name' => 'Apartments',
                'description' => 'Apartment rentals and sales',
                'order' => 400,
                'is_active' => true,
            ]);

            ForumCategory::firstOrCreate([
                'slug' => 'villas',
            ], [
                'parent_id' => $realEstate->id,
                'name' => 'Villas & Houses',
                'description' => 'Villa and house discussions',
                'order' => 401,
                'is_active' => true,
            ]);

            ForumCategory::firstOrCreate([
                'slug' => 'commercial',
            ], [
                'parent_id' => $realEstate->id,
                'name' => 'Commercial Properties',
                'description' => 'Offices, shops, and commercial spaces',
                'order' => 402,
                'is_active' => true,
            ]);
        }

        // Add subcategories for Events
        if ($events) {
            ForumCategory::firstOrCreate([
                'slug' => 'concerts',
            ], [
                'parent_id' => $events->id,
                'name' => 'Concerts & Music',
                'description' => 'Music events and concerts',
                'order' => 500,
                'is_active' => true,
            ]);

            ForumCategory::firstOrCreate([
                'slug' => 'sports-events',
            ], [
                'parent_id' => $events->id,
                'name' => 'Sports Events',
                'description' => 'Sports matches and activities',
                'order' => 501,
                'is_active' => true,
            ]);
        }
    }
}

