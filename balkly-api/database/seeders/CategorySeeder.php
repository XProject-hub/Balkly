<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Attribute;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Auto Category
        $auto = Category::create([
            'slug' => 'auto',
            'name' => 'Auto',
            'icon' => 'car',
            'description' => 'Cars, motorcycles, and vehicles',
            'order' => 1,
            'is_active' => true,
        ]);

        Attribute::create([
            'category_id' => $auto->id,
            'name' => 'Make',
            'slug' => 'make',
            'type' => 'select',
            'options_json' => ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Honda'],
            'is_required' => true,
            'is_searchable' => true,
            'order' => 1,
        ]);

        Attribute::create([
            'category_id' => $auto->id,
            'name' => 'Model',
            'slug' => 'model',
            'type' => 'text',
            'is_required' => true,
            'is_searchable' => true,
            'order' => 2,
        ]);

        Attribute::create([
            'category_id' => $auto->id,
            'name' => 'Year',
            'slug' => 'year',
            'type' => 'number',
            'is_required' => true,
            'is_searchable' => true,
            'order' => 3,
        ]);

        Attribute::create([
            'category_id' => $auto->id,
            'name' => 'Mileage (km)',
            'slug' => 'mileage',
            'type' => 'number',
            'is_required' => false,
            'is_searchable' => true,
            'order' => 4,
        ]);

        Attribute::create([
            'category_id' => $auto->id,
            'name' => 'Fuel Type',
            'slug' => 'fuel_type',
            'type' => 'select',
            'options_json' => ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
            'is_required' => true,
            'is_searchable' => true,
            'order' => 5,
        ]);

        // Real Estate Category
        $realEstate = Category::create([
            'slug' => 'real-estate',
            'name' => 'Real Estate',
            'icon' => 'home',
            'description' => 'Houses, apartments, and properties',
            'order' => 2,
            'is_active' => true,
        ]);

        Attribute::create([
            'category_id' => $realEstate->id,
            'name' => 'Property Type',
            'slug' => 'property_type',
            'type' => 'select',
            'options_json' => ['House', 'Apartment', 'Villa', 'Land', 'Commercial'],
            'is_required' => true,
            'is_searchable' => true,
            'order' => 1,
        ]);

        Attribute::create([
            'category_id' => $realEstate->id,
            'name' => 'Area (m²)',
            'slug' => 'area',
            'type' => 'number',
            'is_required' => true,
            'is_searchable' => true,
            'order' => 2,
        ]);

        Attribute::create([
            'category_id' => $realEstate->id,
            'name' => 'Bedrooms',
            'slug' => 'bedrooms',
            'type' => 'number',
            'is_required' => false,
            'is_searchable' => true,
            'order' => 3,
        ]);

        Attribute::create([
            'category_id' => $realEstate->id,
            'name' => 'Bathrooms',
            'slug' => 'bathrooms',
            'type' => 'number',
            'is_required' => false,
            'is_searchable' => true,
            'order' => 4,
        ]);

        // Events Category
        $events = Category::create([
            'slug' => 'events',
            'name' => 'Events',
            'icon' => 'calendar',
            'description' => 'Concerts, sports, and entertainment',
            'order' => 3,
            'is_active' => true,
        ]);

        Attribute::create([
            'category_id' => $events->id,
            'name' => 'Event Type',
            'slug' => 'event_type',
            'type' => 'select',
            'options_json' => ['Concert', 'Sports', 'Theater', 'Festival', 'Conference'],
            'is_required' => true,
            'is_searchable' => true,
            'order' => 1,
        ]);

        Attribute::create([
            'category_id' => $events->id,
            'name' => 'Date',
            'slug' => 'event_date',
            'type' => 'date',
            'is_required' => true,
            'is_searchable' => true,
            'order' => 2,
        ]);
    }
}

