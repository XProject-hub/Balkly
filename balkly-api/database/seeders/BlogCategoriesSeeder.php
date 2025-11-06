<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // 1. Događaji & Karte
            [
                'name' => 'Događaji & Karte',
                'slug' => 'events',
                'description' => 'Vodiči i preporuke za koncerte, sport, festivale',
                'order' => 1,
                'subcategories' => [
                    ['name' => 'Koncerti', 'slug' => 'concerts'],
                    ['name' => 'Sport', 'slug' => 'sports'],
                    ['name' => 'Family & Kids', 'slug' => 'family'],
                    ['name' => 'Nightlife & Brunch', 'slug' => 'nightlife'],
                ]
            ],

            // 2. Vodiči za Dubai & UAE
            [
                'name' => 'Vodiči za Dubai & UAE',
                'slug' => 'uae',
                'description' => 'Praktične "how-to" teme za život i boravak',
                'order' => 2,
                'subcategories' => [
                    ['name' => 'Transport', 'slug' => 'transport'],
                    ['name' => 'Sim & Internet', 'slug' => 'sim'],
                    ['name' => 'Cijene & budžet', 'slug' => 'cost-of-living'],
                    ['name' => 'Turistički savjeti', 'slug' => 'tips'],
                ]
            ],

            // 3. Kupoprodaja & Oglasi
            [
                'name' => 'Kupoprodaja & Oglasi',
                'slug' => 'classifieds',
                'description' => 'Kako kupiti/prodati sigurno na Balkly',
                'order' => 3,
                'subcategories' => [
                    ['name' => 'Sigurna kupovina', 'slug' => 'safety'],
                    ['name' => 'Savjeti za prodaju', 'slug' => 'selling'],
                    ['name' => 'Scam alert', 'slug' => 'scams'],
                ]
            ],

            // 4. Nekretnine
            [
                'name' => 'Nekretnine',
                'slug' => 'real-estate',
                'description' => 'Najam/kupovina, kvartovi, dokumentacija',
                'order' => 4,
                'subcategories' => [
                    ['name' => 'Najam', 'slug' => 'rent'],
                    ['name' => 'Kupovina', 'slug' => 'buy'],
                    ['name' => 'Kvartovi', 'slug' => 'areas'],
                    ['name' => 'Pravni savjeti', 'slug' => 'legal'],
                ]
            ],

            // 5. Automobili & Mobilnost
            [
                'name' => 'Automobili & Mobilnost',
                'slug' => 'auto',
                'description' => 'Kupovina, registracija, servis, rent-a-car',
                'order' => 5,
                'subcategories' => [
                    ['name' => 'Kupovina auta', 'slug' => 'buy'],
                    ['name' => 'Registracija & osiguranje', 'slug' => 'registration'],
                    ['name' => 'Rent & car-sharing', 'slug' => 'rent'],
                ]
            ],

            // 6. Poslovi & Biznis
            [
                'name' => 'Poslovi & Biznis',
                'slug' => 'work',
                'description' => 'Posao u UAE, freelancing, firme (RAKEZ/IFZA/DMCC)',
                'order' => 6,
                'subcategories' => [
                    ['name' => 'Traženje posla', 'slug' => 'jobs'],
                    ['name' => 'CV & intervjui', 'slug' => 'cv'],
                    ['name' => 'Osnivanje firme', 'slug' => 'incorporation'],
                ]
            ],

            // 7. Finansije & Porezi
            [
                'name' => 'Finansije & Porezi',
                'slug' => 'finance',
                'description' => 'Svakodnevni troškovi, kartice, porezne osnove (EU/UAE)',
                'order' => 7,
                'subcategories' => [
                    ['name' => 'Banke & kartice', 'slug' => 'banking'],
                    ['name' => 'Porezi', 'slug' => 'tax'],
                    ['name' => 'Budžet & štednja', 'slug' => 'budgeting'],
                ]
            ],

            // 8. Putovanja & Vize
            [
                'name' => 'Putovanja & Vize',
                'slug' => 'travel',
                'description' => 'Vize, aerodromi, kratki izleti iz Dubaija',
                'order' => 8,
                'subcategories' => [
                    ['name' => 'Vize & dokumenti', 'slug' => 'visas'],
                    ['name' => 'Itinereri', 'slug' => 'itineraries'],
                    ['name' => 'Vikend izleti', 'slug' => 'weekend-trips'],
                ]
            ],

            // 9. Porodica & Lifestyle
            [
                'name' => 'Porodica & Lifestyle',
                'slug' => 'family',
                'description' => 'Škole, aktivnosti s djecom, zdravlje, kućni ljubimci',
                'order' => 9,
                'subcategories' => [
                    ['name' => 'Škole & edukacija', 'slug' => 'schools'],
                    ['name' => 'Aktivnosti', 'slug' => 'activities'],
                    ['name' => 'Pets', 'slug' => 'pets'],
                ]
            ],

            // 10. Elektronika & Gadgeti
            [
                'name' => 'Elektronika & Gadgeti',
                'slug' => 'electronics',
                'description' => 'Kupovina gadgeta u UAE, cijene, poređenje',
                'order' => 10,
                'subcategories' => [
                    ['name' => 'Kupovina & recenzije', 'slug' => 'reviews'],
                    ['name' => 'Best-value vodiči', 'slug' => 'deals'],
                ]
            ],

            // 11. Restorani & Iskustva
            [
                'name' => 'Restorani & Iskustva',
                'slug' => 'food',
                'description' => 'Brunch, fine-dining, halal opcije, coffee spotovi',
                'order' => 11,
                'subcategories' => [
                    ['name' => 'Preporuke', 'slug' => 'top-picks'],
                    ['name' => 'Brunch & nightlife', 'slug' => 'brunch'],
                    ['name' => 'Porodična mjesta', 'slug' => 'family'],
                ]
            ],

            // 12. Balkanski kutak u UAE
            [
                'name' => 'Balkanski kutak u UAE',
                'slug' => 'balkan',
                'description' => 'Zajednica, događaji, usluge "na našem"',
                'order' => 12,
                'subcategories' => [
                    ['name' => 'Za zajednicu', 'slug' => 'community'],
                    ['name' => 'Usluge na našem', 'slug' => 'services'],
                    ['name' => 'Priče iseljenika', 'slug' => 'stories'],
                ]
            ],

            // 13. Sigurnost & Online zaštita
            [
                'name' => 'Sigurnost & Online zaštita',
                'slug' => 'security',
                'description' => 'Sigurnost na oglasima, plaćanja, privatnost',
                'order' => 13,
                'subcategories' => [
                    ['name' => 'Plaćanja & escrow', 'slug' => 'payments'],
                    ['name' => 'Privatnost', 'slug' => 'privacy'],
                ]
            ],

            // 14. Novosti & Balkly update-i
            [
                'name' => 'Novosti & Balkly update-i',
                'slug' => 'news',
                'description' => 'Release note-ovi, partnerstva, akcije',
                'order' => 14,
                'subcategories' => [
                    ['name' => 'Product updates', 'slug' => 'updates'],
                    ['name' => 'Partnerstva', 'slug' => 'partners'],
                    ['name' => 'Promo & popusti', 'slug' => 'deals'],
                ]
            ],
        ];

        foreach ($categories as $categoryData) {
            $subcategories = $categoryData['subcategories'] ?? [];
            unset($categoryData['subcategories']);

            // Check if category exists
            $category = DB::table('blog_categories')->where('slug', $categoryData['slug'])->first();
            
            if (!$category) {
                $categoryId = DB::table('blog_categories')->insertGetId(array_merge($categoryData, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            } else {
                $categoryId = $category->id;
            }

            // Insert subcategories
            foreach ($subcategories as $subData) {
                DB::table('blog_categories')->updateOrInsert(
                    ['parent_slug' => $categoryData['slug'], 'slug' => $subData['slug']],
                    [
                        'name' => $subData['name'],
                        'parent_id' => $categoryId,
                        'parent_slug' => $categoryData['slug'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        echo "✅ Blog categories seeded with 14 main categories and 40+ subcategories!\n";
    }
}

