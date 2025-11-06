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
            // ForumCategorySeeder::class,  // Old seeder - replaced
            // ForumSubcategoriesSeeder::class,  // Old seeder - replaced
            CompleteForumCategoriesSeeder::class,  // New complete Serbian/Bosnian structure
            UserSeeder::class,
            KnowledgeBaseSeeder::class,
            BlogCategoriesSeeder::class,
        ]);
    }
}

