<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@balkly.com',
            'password' => Hash::make('password123'),
            'locale' => 'en',
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $admin->id,
            'bio' => 'Platform administrator',
        ]);

        // Test seller
        $seller = User::create([
            'name' => 'John Seller',
            'email' => 'seller@balkly.com',
            'password' => Hash::make('password123'),
            'locale' => 'en',
            'role' => 'seller',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $seller->id,
            'phone' => '+38761234567',
            'city' => 'Sarajevo',
            'country' => 'BA',
            'bio' => 'Professional seller',
        ]);

        // Test buyer
        $buyer = User::create([
            'name' => 'Jane Buyer',
            'email' => 'buyer@balkly.com',
            'password' => Hash::make('password123'),
            'locale' => 'en',
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        Profile::create([
            'user_id' => $buyer->id,
            'city' => 'Banja Luka',
            'country' => 'BA',
        ]);
    }
}

