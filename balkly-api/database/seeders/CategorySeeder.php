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
            'name' => 'Brand',
            'slug' => 'brand',
            'type' => 'select',
            'options_json' => [
                // Japanese Brands
                'Toyota', 'Lexus', 'Daihatsu', 'Hino', 'Subaru', 'Nissan', 'Infiniti', 
                'Honda', 'Acura', 'Mazda', 'Mitsubishi', 'Suzuki', 'Isuzu',
                // German Brands
                'Volkswagen', 'Audi', 'Porsche', 'Mercedes-Benz', 'Maybach', 'BMW', 
                'MINI', 'Smart', 'Opel', 'Alpina',
                // French Brands
                'Renault', 'Dacia', 'Alpine', 'Peugeot', 'Citroën', 'DS Automobiles', 'Bugatti',
                // Italian Brands
                'Fiat', 'Abarth', 'Alfa Romeo', 'Lancia', 'Ferrari', 'Maserati', 
                'Lamborghini', 'Pagani', 'Iveco',
                // British Brands
                'Aston Martin', 'Bentley', 'Rolls-Royce', 'Jaguar', 'Land Rover', 
                'Lotus', 'McLaren', 'MG', 'Vauxhall', 'Caterham', 'TVR', 'Morgan',
                // American Brands
                'Ford', 'Lincoln', 'Chevrolet', 'Buick', 'GMC', 'Cadillac', 
                'Chrysler', 'Dodge', 'Ram', 'Jeep', 'Tesla', 'Rivian', 'Lucid', 
                'Fisker', 'Karma',
                // Korean Brands
                'Hyundai', 'Genesis', 'Kia', 'SsangYong',
                // Swedish Brands
                'Volvo', 'Polestar', 'Koenigsegg', 'Saab',
                // Spanish/Czech Brands
                'SEAT', 'Cupra', 'Skoda', 'Tatra',
                // Russian Brands
                'Lada', 'GAZ', 'UAZ',
                // Chinese Brands
                'BYD', 'Geely', 'Great Wall Motors', 'Haval', 'Ora', 'Tank', 'Wey', 
                'Chery', 'SAIC Motor', 'Roewe', 'Maxus', 'Wuling', 'Baojun', 
                'NIO', 'XPeng', 'Li Auto', 'Hongqi', 'FAW', 'Dongfeng', 'GAC', 
                'Trumpchi', 'Aion', 'JAC', 'BAIC', 'Arcfox', 'Foton', 
                'Lynk & Co', 'Zeekr',
                // Indian Brands
                'Tata Motors', 'Mahindra', 'Maruti Suzuki', 'Force Motors',
                // Other Brands
                'Togg', 'Khodro', 'Saipa', 'Proton', 'Perodua', 'VinFast', 
                'Spyker', 'Donkervoort', 'KTM', 'Rimac', 'Mastretta',
            ],
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
            'metadata' => json_encode([
                'min' => 1980,
                'max' => date('Y') + 1,
                'validation' => 'Year must be between 1980 and ' . (date('Y') + 1),
            ]),
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

        Attribute::create([
            'category_id' => $auto->id,
            'name' => 'Body Type',
            'slug' => 'body_type',
            'type' => 'select',
            'options_json' => [
                'Sedan', 'Hatchback', 'SUV', 'Coupe', 'Convertible', 
                'Wagon', 'Van', 'Pickup Truck', 'Minivan', 'Limuzina', 
                'Crossover', 'Sports Car', 'Luxury Car'
            ],
            'is_required' => false,
            'is_searchable' => true,
            'order' => 6,
        ]);

        Attribute::create([
            'category_id' => $auto->id,
            'name' => 'Transmission',
            'slug' => 'transmission',
            'type' => 'select',
            'options_json' => ['Automatic', 'Manual', 'Semi-Automatic'],
            'is_required' => false,
            'is_searchable' => true,
            'order' => 7,
        ]);

        Attribute::create([
            'category_id' => $auto->id,
            'name' => 'Color',
            'slug' => 'color',
            'type' => 'select',
            'options_json' => [
                'Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 
                'Green', 'Yellow', 'Orange', 'Brown', 'Gold', 'Beige', 'Other'
            ],
            'is_required' => false,
            'is_searchable' => true,
            'order' => 8,
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

        // Sports & Hobbies Category
        $sports = Category::create([
            'slug' => 'sports',
            'name' => 'Sports & Hobbies',
            'icon' => 'activity',
            'description' => 'Sports equipment and hobby items',
            'order' => 4,
            'is_active' => true,
        ]);

        Attribute::create([
            'category_id' => $sports->id,
            'name' => 'Sport Type',
            'slug' => 'sport_type',
            'type' => 'select',
            'options_json' => [
                // Ball Sports
                'Football / Soccer', 'Basketball', 'Volleyball', 'Handball', 'Tennis', 
                'Table Tennis', 'Badminton', 'Baseball', 'Rugby', 'American Football',
                // Water Sports
                'Swimming', 'Diving', 'Water Polo', 'Surfing', 'Kayaking', 'Sailing',
                'Jet Ski', 'Scuba Diving', 'Snorkeling', 'Kitesurfing',
                // Winter Sports
                'Skiing', 'Snowboarding', 'Ice Hockey', 'Ice Skating', 'Figure Skating',
                // Fitness & Gym
                'Gym Equipment', 'Weights', 'Cardio', 'Yoga', 'Pilates', 'CrossFit',
                // Outdoor Sports
                'Cycling', 'Mountain Biking', 'Running', 'Hiking', 'Camping', 
                'Rock Climbing', 'Skateboarding', 'Rollerblading',
                // Racket Sports
                'Squash', 'Racquetball', 'Padel',
                // Combat Sports
                'Boxing', 'MMA', 'Karate', 'Judo', 'Taekwondo', 'Kickboxing', 'Wrestling',
                // Golf & Others
                'Golf', 'Cricket', 'Archery', 'Shooting', 'Fishing', 'Hunting',
                // Hobbies
                'Arts & Crafts', 'Photography', 'Music Instruments', 'Board Games', 
                'Video Games', 'RC Models', 'Drones', 'Collectibles',
            ],
            'is_required' => true,
            'is_searchable' => true,
            'order' => 1,
        ]);

        Attribute::create([
            'category_id' => $sports->id,
            'name' => 'Condition',
            'slug' => 'condition',
            'type' => 'select',
            'options_json' => ['New', 'Like New', 'Good', 'Fair', 'Used'],
            'is_required' => true,
            'is_searchable' => true,
            'order' => 2,
        ]);

        Attribute::create([
            'category_id' => $sports->id,
            'name' => 'Brand',
            'slug' => 'sports_brand',
            'type' => 'text',
            'is_required' => false,
            'is_searchable' => true,
            'order' => 3,
        ]);
    }
}

