<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumCategory;
use Illuminate\Support\Facades\DB;

class CompleteForumCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing categories
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ForumCategory::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $categories = [
            // 1. Life in the UAE
            [
                'name' => 'Life in the UAE',
                'slug' => 'life-in-uae',
                'description' => 'Everything about daily life, adapting, and living in the Emirates.',
                'icon' => 'home',
                'order' => 1,
                'subcategories' => [
                    ['name' => 'Getting Started in UAE', 'slug' => 'getting-started', 'description' => 'Visas, residence, first steps, documents'],
                    ['name' => 'Housing & Accommodation', 'slug' => 'housing', 'description' => 'Renting, buying, roommates, contracts'],
                    ['name' => 'Cost of Living & Expenses', 'slug' => 'cost-of-living', 'description' => 'Prices, budgeting, lifestyle comparisons'],
                    ['name' => 'Healthcare & Insurance', 'slug' => 'healthcare', 'description' => 'Clinics, hospitals, health insurance'],
                    ['name' => 'Education & Schools', 'slug' => 'education', 'description' => 'Schools, universities, courses for kids & adults'],
                ]
            ],

            // 2. Jobs & Business
            [
                'name' => 'Jobs & Business',
                'slug' => 'jobs-business',
                'description' => 'Work opportunities and entrepreneurship.',
                'icon' => 'briefcase',
                'order' => 2,
                'subcategories' => [
                    ['name' => 'Job Opportunities', 'slug' => 'job-opportunities', 'description' => 'Open positions, hiring posts, CV tips'],
                    ['name' => 'Career Advice', 'slug' => 'career-advice', 'description' => 'Interviews, salaries, contracts'],
                    ['name' => 'Starting a Business', 'slug' => 'starting-business', 'description' => 'Company setup, licenses, free zones'],
                    ['name' => 'Freelancing & Remote Work', 'slug' => 'freelancing', 'description' => 'Freelance visas, platforms, taxes'],
                ]
            ],

            // 3. Buy, Sell & Services
            [
                'name' => 'Buy, Sell & Services',
                'slug' => 'buy-sell-services',
                'description' => 'Marketplace for the Balkan community.',
                'icon' => 'shopping-bag',
                'order' => 3,
                'subcategories' => [
                    ['name' => 'Buy & Sell', 'slug' => 'buy-sell', 'description' => 'Cars, furniture, electronics, personal items'],
                    ['name' => 'Services', 'slug' => 'services', 'description' => 'Cleaning, IT, fitness, beauty, consulting'],
                    ['name' => 'Real Estate Offers', 'slug' => 'real-estate', 'description' => 'Rentals, properties for sale, agents'],
                    ['name' => 'Promotions & Deals', 'slug' => 'promotions', 'description' => 'Discounts, partner offers, promotions'],
                ]
            ],

            // 4. Moving to the UAE
            [
                'name' => 'Moving to the UAE',
                'slug' => 'moving-to-uae',
                'description' => 'For those planning to come.',
                'icon' => 'plane',
                'order' => 4,
                'subcategories' => [
                    ['name' => 'Visa Types & Requirements', 'slug' => 'visa-types', 'description' => 'Work visa, freelance visa, golden visa'],
                    ['name' => 'Relocation Experiences', 'slug' => 'relocation', 'description' => 'Real stories, advice from people already here'],
                    ['name' => "Do's & Don'ts in UAE", 'slug' => 'dos-donts', 'description' => 'Laws, culture, common mistakes'],
                ]
            ],

            // 5. Balkan Community
            [
                'name' => 'Balkan Community',
                'slug' => 'balkan-community',
                'description' => 'Connect with people from the Balkans.',
                'icon' => 'users',
                'order' => 5,
                'subcategories' => [
                    ['name' => 'Meetups & Events', 'slug' => 'meetups', 'description' => 'Community gatherings, networking'],
                    ['name' => 'Help & Advice', 'slug' => 'help-advice', 'description' => 'Ask for help, recommendations'],
                    ['name' => 'Introductions', 'slug' => 'introductions', 'description' => 'New members say hello'],
                ]
            ],

            // 6. Guides & Resources
            [
                'name' => 'Guides & Resources',
                'slug' => 'guides-resources',
                'description' => 'Structured knowledge and useful info.',
                'icon' => 'book-open',
                'order' => 6,
                'subcategories' => [
                    ['name' => 'Step-by-Step Guides', 'slug' => 'step-by-step', 'description' => 'How-to guides for common situations'],
                    ['name' => 'Legal & Regulations', 'slug' => 'legal', 'description' => 'Laws, contracts, official rules'],
                    ['name' => 'Useful Links & Tools', 'slug' => 'useful-links', 'description' => 'Government portals, apps, websites'],
                ]
            ],

            // 7. Off-Topic & Lounge
            [
                'name' => 'Off-Topic & Lounge',
                'slug' => 'off-topic',
                'description' => 'Relaxed discussions.',
                'icon' => 'coffee',
                'order' => 7,
                'subcategories' => [
                    ['name' => 'General Chat', 'slug' => 'general-chat', 'description' => 'Anything not fitting other categories'],
                    ['name' => 'News & Discussions', 'slug' => 'news', 'description' => 'UAE & global news'],
                    ['name' => 'Lifestyle & Entertainment', 'slug' => 'lifestyle', 'description' => 'Food, gyms, travel, hobbies'],
                ]
            ],

            // 8. Balkly Platform
            [
                'name' => 'Balkly Platform',
                'slug' => 'balkly-platform',
                'description' => 'Everything related to Balkly itself.',
                'icon' => 'megaphone',
                'order' => 8,
                'subcategories' => [
                    ['name' => 'Announcements', 'slug' => 'announcements', 'description' => 'Updates, new features'],
                    ['name' => 'Feedback & Suggestions', 'slug' => 'feedback', 'description' => 'Ideas, improvements'],
                    ['name' => 'Support & Issues', 'slug' => 'support', 'description' => 'Bug reports, help with the platform'],
                ]
            ],

            // 9. Rules & Moderation
            [
                'name' => 'Rules & Moderation',
                'slug' => 'rules-moderation',
                'description' => 'Community standards.',
                'icon' => 'shield',
                'order' => 9,
                'subcategories' => [
                    ['name' => 'Forum Rules', 'slug' => 'forum-rules', 'description' => 'Guidelines and policies'],
                    ['name' => 'Reports & Moderation', 'slug' => 'reports', 'description' => 'Report issues or users'],
                ]
            ],
        ];

        foreach ($categories as $catData) {
            $subcategories = $catData['subcategories'] ?? [];
            unset($catData['subcategories']);

            // Create parent category
            $category = ForumCategory::create($catData);

            // Create subcategories
            foreach ($subcategories as $subData) {
                ForumCategory::create([
                    'parent_id' => $category->id,
                    'name' => $subData['name'],
                    'slug' => $category->slug . '-' . $subData['slug'],
                    'description' => $subData['description'] ?? null,
                    'icon' => 'folder',
                    'order' => $category->order,
                    'is_active' => true,
                ]);
            }
        }

        echo "✅ Forum categories seeded with " . ForumCategory::whereNull('parent_id')->count() . " main categories\n";
        echo "✅ Total subcategories: " . ForumCategory::whereNotNull('parent_id')->count() . "\n";
        echo "✅ Total categories: " . ForumCategory::count() . "\n";
    }
}
