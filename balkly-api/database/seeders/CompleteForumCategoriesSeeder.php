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
            // 0. Balkly Obavijesti (samo admin)
            [
                'name' => 'Balkly Obavijesti',
                'slug' => 'obavijesti',
                'description' => 'Službene obavijesti platforme (samo admin)',
                'icon' => 'megaphone',
                'order' => 0,
                'subcategories' => [
                    ['name' => 'Novosti & promjene', 'slug' => 'novosti', 'description' => 'Novosti i izmjene na platformi'],
                    ['name' => 'Pravila foruma & marketplace-a', 'slug' => 'pravila', 'description' => 'Važna pravila korištenja'],
                    ['name' => 'Sigurna kupovina (escrow, savjeti)', 'slug' => 'sigurnost', 'description' => 'Savjeti za sigurnu trgovinu'],
                    ['name' => 'Scam alert & crna lista prodavača', 'slug' => 'scam-alert', 'description' => 'Upozorenja o prevarantima'],
                ]
            ],

            // 1. Oglasi (Kupujem/Prodajem/Zamjena)
            [
                'name' => 'Elektronika & IT',
                'slug' => 'elektronika',
                'description' => 'Prodaja i kupovina elektronike',
                'icon' => 'smartphone',
                'order' => 1,
                'subcategories' => [
                    ['name' => 'Mobiteli', 'slug' => 'mobiteli'],
                    ['name' => 'Laptopi/PC', 'slug' => 'laptopi'],
                    ['name' => 'Komponente', 'slug' => 'komponente'],
                    ['name' => 'TV/Audio', 'slug' => 'tv-audio'],
                    ['name' => 'Foto/Video', 'slug' => 'foto-video'],
                    ['name' => 'Gaming', 'slug' => 'gaming'],
                ]
            ],

            [
                'name' => 'Vozila & Dijelovi',
                'slug' => 'vozila',
                'description' => 'Automobili, motori i oprema',
                'icon' => 'car',
                'order' => 2,
                'subcategories' => [
                    ['name' => 'Automobili', 'slug' => 'automobili'],
                    ['name' => 'Motori/Skuteri', 'slug' => 'motori'],
                    ['name' => 'Dijelovi/Oprema', 'slug' => 'dijelovi'],
                    ['name' => 'Gume/Felge', 'slug' => 'gume'],
                ]
            ],

            [
                'name' => 'Nekretnine',
                'slug' => 'nekretnine',
                'description' => 'Stanovi, kuće, iznajmljivanje',
                'icon' => 'home',
                'order' => 3,
                'subcategories' => [
                    ['name' => 'Iznajmljivanje', 'slug' => 'iznajmljivanje'],
                    ['name' => 'Prodaja', 'slug' => 'prodaja'],
                    ['name' => 'Kratkoročni najam', 'slug' => 'kratkorocni'],
                    ['name' => 'Tražim smještaj', 'slug' => 'trazim-smjestaj'],
                    ['name' => 'Agencije/Servisi', 'slug' => 'agencije'],
                ]
            ],

            [
                'name' => 'Dom & Namještaj',
                'slug' => 'dom',
                'description' => 'Namještaj i kućanski uređaji',
                'icon' => 'sofa',
                'order' => 4,
                'subcategories' => [
                    ['name' => 'Namještaj', 'slug' => 'namjestaj'],
                    ['name' => 'Kućanski uređaji', 'slug' => 'uredjaji'],
                    ['name' => 'Alat & DIY', 'slug' => 'alat'],
                    ['name' => 'Vrt', 'slug' => 'vrt'],
                ]
            ],

            [
                'name' => 'Moda & Ljepota',
                'slug' => 'moda',
                'description' => 'Odjeća, obuća, kozmetika',
                'icon' => 'shirt',
                'order' => 5,
                'subcategories' => [
                    ['name' => 'Muško', 'slug' => 'musko'],
                    ['name' => 'Žensko', 'slug' => 'zensko'],
                    ['name' => 'Dječije', 'slug' => 'djecije'],
                    ['name' => 'Satovi/Nakit', 'slug' => 'satovi-nakit'],
                    ['name' => 'Beauty', 'slug' => 'beauty'],
                ]
            ],

            [
                'name' => 'Sport, Hobi & Muzika',
                'slug' => 'hobi',
                'description' => 'Sportska oprema, hobiji, instrumenti',
                'icon' => 'dumbbell',
                'order' => 6,
                'subcategories' => [
                    ['name' => 'Bicikli', 'slug' => 'bicikli'],
                    ['name' => 'Fitness', 'slug' => 'fitness'],
                    ['name' => 'Ribolov', 'slug' => 'ribolov'],
                    ['name' => 'Instrumenti', 'slug' => 'instrumenti'],
                    ['name' => 'Kolekcionarstvo', 'slug' => 'kolekcionarstvo'],
                ]
            ],

            [
                'name' => 'Dječije & Bebe',
                'slug' => 'djecije',
                'description' => 'Dječija oprema i igračke',
                'icon' => 'baby',
                'order' => 7,
            ],

            [
                'name' => 'Ljubimci & Oprema',
                'slug' => 'pets',
                'description' => 'Kućni ljubimci i oprema za njih',
                'icon' => 'paw',
                'order' => 8,
            ],

            [
                'name' => 'Karte & Iskustva',
                'slug' => 'karte',
                'description' => 'Koncerti, sport, atrakcije',
                'icon' => 'ticket',
                'order' => 9,
            ],

            [
                'name' => 'Na veliko / B2B',
                'slug' => 'veleprodaja',
                'description' => 'Veleprodaja i B2B ponude',
                'icon' => 'package',
                'order' => 10,
            ],

            [
                'name' => 'Zamjena / Trade',
                'slug' => 'zamjena',
                'description' => 'Zamjena robe bez novca',
                'icon' => 'repeat',
                'order' => 11,
            ],

            [
                'name' => 'Tražim (Kupujem)',
                'slug' => 'trazim',
                'description' => 'Tražite određenu stvar',
                'icon' => 'search',
                'order' => 12,
            ],

            [
                'name' => 'Poklanjam / Freebies',
                'slug' => 'poklanjam',
                'description' => 'Besplatno poklanjanje stvari',
                'icon' => 'gift',
                'order' => 13,
            ],

            [
                'name' => 'Arhiva / Prodano',
                'slug' => 'arhiva',
                'description' => 'Završene transakcije',
                'icon' => 'archive',
                'order' => 14,
            ],

            // 2. Poslovi
            [
                'name' => 'Ponude poslova',
                'slug' => 'ponude-poslova',
                'description' => 'Oglasi za zapošljavanje',
                'icon' => 'briefcase',
                'order' => 15,
                'subcategories' => [
                    ['name' => 'Full-time', 'slug' => 'full-time'],
                    ['name' => 'Part-time', 'slug' => 'part-time'],
                    ['name' => 'Freelance/Contract', 'slug' => 'freelance'],
                    ['name' => 'Sezonski', 'slug' => 'sezonski'],
                    ['name' => 'Remote', 'slug' => 'remote'],
                ]
            ],

            [
                'name' => 'Po industriji',
                'slug' => 'industrije',
                'description' => 'Poslovi po sektorima',
                'icon' => 'building',
                'order' => 16,
                'subcategories' => [
                    ['name' => 'IT/Software', 'slug' => 'it-software'],
                    ['name' => 'Ugostiteljstvo & Turizam', 'slug' => 'ugostiteljstvo'],
                    ['name' => 'Maloprodaja', 'slug' => 'maloprodaja'],
                    ['name' => 'Građevina', 'slug' => 'gradjevina'],
                    ['name' => 'Logistika/Vozači', 'slug' => 'logistika'],
                    ['name' => 'Prodaja/Marketing', 'slug' => 'prodaja'],
                    ['name' => 'Admin/Finansije', 'slug' => 'admin'],
                    ['name' => 'Zdravstvo', 'slug' => 'zdravstvo'],
                    ['name' => 'Edukacija', 'slug' => 'edukacija'],
                    ['name' => 'Kreativa/Media', 'slug' => 'kreativa'],
                ]
            ],

            [
                'name' => 'Tražim posao (CV/Portfolio)',
                'slug' => 'trazim-posao',
                'description' => 'Kandidati koji traže posao',
                'icon' => 'user-search',
                'order' => 17,
            ],

            [
                'name' => 'Gigs / Mikro-poslovi',
                'slug' => 'gigs',
                'description' => 'Kratki jednokratni poslovi',
                'icon' => 'zap',
                'order' => 18,
            ],

            [
                'name' => 'Vize, radne dozvole & ugovori',
                'slug' => 'vize-savjeti',
                'description' => 'Savjeti o radnim vizama i ugovorima',
                'icon' => 'file-text',
                'order' => 19,
            ],

            // 3. Usluge
            [
                'name' => 'Profesionalne usluge',
                'slug' => 'profesionalne',
                'description' => 'Računovodstvo, pravne, marketing, dizajn',
                'icon' => 'briefcase',
                'order' => 20,
            ],

            [
                'name' => 'Tech & Instalacije',
                'slug' => 'tech-instalacije',
                'description' => 'IT support, mreže, CCTV, klima, majstori',
                'icon' => 'wrench',
                'order' => 21,
            ],

            [
                'name' => 'Dostave, selidbe & čišćenje',
                'slug' => 'logistika-usluge',
                'description' => 'Logističke usluge',
                'icon' => 'truck',
                'order' => 22,
            ],

            [
                'name' => 'Edukacija & kursevi',
                'slug' => 'edukacija-kursevi',
                'description' => 'Jezici, muzika, programiranje, instrukcije',
                'icon' => 'graduation-cap',
                'order' => 23,
            ],

            // 4. Eventi & Aktivnosti
            [
                'name' => 'Najave & recenzije',
                'slug' => 'eventi-najave',
                'description' => 'Najave i recenzije događaja',
                'icon' => 'calendar',
                'order' => 24,
                'subcategories' => [
                    ['name' => 'Koncerti', 'slug' => 'koncerti'],
                    ['name' => 'Sport', 'slug' => 'sport'],
                    ['name' => 'Porodično', 'slug' => 'porodicno'],
                    ['name' => 'Nightlife/Brunch', 'slug' => 'nightlife'],
                ]
            ],

            [
                'name' => 'Tražim ekipu / dijelim troškove',
                'slug' => 'ekipa',
                'description' => 'Car-share, stol, box',
                'icon' => 'users',
                'order' => 25,
            ],

            // 5. Putovanja, Vize & Život u UAE/EU
            [
                'name' => 'Vize & birokratija',
                'slug' => 'vize',
                'description' => 'Vizna procedura i papiri',
                'icon' => 'passport',
                'order' => 26,
            ],

            [
                'name' => 'Smještaj, škole, zdravstvo',
                'slug' => 'zivot',
                'description' => 'Praktični aspekti života',
                'icon' => 'heart',
                'order' => 27,
            ],

            [
                'name' => 'Savjeti za nove stanovnike',
                'slug' => 'savjeti',
                'description' => 'Vodič za pridošlice',
                'icon' => 'info',
                'order' => 28,
            ],

            // 6. Zajednica (Balkanski kutak)
            [
                'name' => 'Kafica / Off-topic chat',
                'slug' => 'chat',
                'description' => 'Neobavezno ćaskanje',
                'icon' => 'message-circle',
                'order' => 29,
            ],

            [
                'name' => 'Generalna diskusija',
                'slug' => 'generalno',
                'description' => 'Opće teme',
                'icon' => 'messages',
                'order' => 30,
            ],

            [
                'name' => 'Preporuke po kvartu',
                'slug' => 'kvartovi',
                'description' => 'Dubai, Abu Dhabi, Vienna...',
                'icon' => 'map-pin',
                'order' => 31,
            ],

            [
                'name' => 'Kupujem iz domovine / šaljem u domovinu',
                'slug' => 'dostave',
                'description' => 'Dostave između UAE i Balkana',
                'icon' => 'package',
                'order' => 32,
            ],

            [
                'name' => 'Humanitarno & pomoć',
                'slug' => 'pomoc',
                'description' => 'Pomoć zajednici',
                'icon' => 'heart-handshake',
                'order' => 33,
            ],

            // 7. Podrška & Povratne informacije
            [
                'name' => 'Prijava prevare / sumnjiv oglas',
                'slug' => 'prijave',
                'description' => 'Prijavite sumnjive aktivnosti',
                'icon' => 'alert-triangle',
                'order' => 34,
            ],

            [
                'name' => 'Prijedlozi & bugovi',
                'slug' => 'feedback',
                'description' => 'Vaše ideje i prijave grešaka',
                'icon' => 'lightbulb',
                'order' => 35,
            ],

            [
                'name' => 'Sporovi & rješenja',
                'slug' => 'sporovi',
                'description' => 'Rješavanje sporova uz moderaciju',
                'icon' => 'scale',
                'order' => 36,
            ],

            [
                'name' => 'Testni postovi (sandbox)',
                'slug' => 'test',
                'description' => 'Testiranje foruma',
                'icon' => 'flask',
                'order' => 37,
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

