<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            AdditionalCategoriesSeeder::class,
            PlanSeeder::class,
            CompleteForumCategoriesSeeder::class,
            UserSeeder::class,
            EventSeeder::class,
            KnowledgeBaseSeeder::class,
            BlogCategoriesSeeder::class,
        ]);
    }
}

