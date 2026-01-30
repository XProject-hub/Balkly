<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $organizer = User::where('role', 'admin')->first() ?? User::first();
        
        if (!$organizer) {
            $this->command->warn('No users found. Skipping EventSeeder.');
            return;
        }

        $events = [
            [
                'type' => 'concert',
                'title' => 'Balkan Night Dubai - Live Music',
                'description' => 'Najveća balkanska žurka u Dubaiju! Uživajte u živoj muzici, tradicionalnoj hrani i odličnoj atmosferi. DJ setovi i live bendovi cijelu noć.',
                'venue' => 'Barasti Beach Bar',
                'address' => 'Le Méridien Mina Seyahi Beach Resort',
                'city' => 'Dubai',
                'country' => 'UAE',
                'start_at' => now()->addDays(7)->setTime(21, 0),
                'end_at' => now()->addDays(8)->setTime(3, 0),
                'image_url' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
                'status' => 'published',
            ],
            [
                'type' => 'sport',
                'title' => 'Dubai Football Tournament - Balkanska Liga',
                'description' => 'Godišnji fudbalski turnir za balkansku zajednicu u UAE. Prijavite svoj tim i osvojite vrijedne nagrade!',
                'venue' => 'Dubai Sports City',
                'address' => 'Dubai Sports City, Emirates Road',
                'city' => 'Dubai',
                'country' => 'UAE',
                'start_at' => now()->addDays(14)->setTime(16, 0),
                'end_at' => now()->addDays(14)->setTime(22, 0),
                'image_url' => 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
                'status' => 'published',
            ],
            [
                'type' => 'networking',
                'title' => 'Balkly Business Meetup',
                'description' => 'Mjesečni networking event za preduzetnike i profesionalce iz regiona. Upoznajte ljude, razmjenite ideje i proširite svoju mrežu kontakata.',
                'venue' => 'DIFC Gate Village',
                'address' => 'Gate Village, Building 3',
                'city' => 'Dubai',
                'country' => 'UAE',
                'start_at' => now()->addDays(10)->setTime(18, 30),
                'end_at' => now()->addDays(10)->setTime(21, 30),
                'image_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                'status' => 'published',
            ],
            [
                'type' => 'cultural',
                'title' => 'Večer Bosanske Poezije',
                'description' => 'Kulturna večer posvećena bosanskoj poeziji i književnosti. Gostuju poznati pjesnici iz regiona.',
                'venue' => 'Alserkal Avenue',
                'address' => 'Al Quoz Industrial Area 1',
                'city' => 'Dubai',
                'country' => 'UAE',
                'start_at' => now()->addDays(21)->setTime(19, 0),
                'end_at' => now()->addDays(21)->setTime(22, 0),
                'image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
                'status' => 'published',
            ],
            [
                'type' => 'food',
                'title' => 'Balkan Food Festival Dubai',
                'description' => 'Trodnevni festival balkanske hrane! Ćevapi, burek, sarma, pljeskavice i još mnogo toga. Pridružite nam se za gastronomsko putovanje.',
                'venue' => 'JBR The Walk',
                'address' => 'Jumeirah Beach Residence',
                'city' => 'Dubai',
                'country' => 'UAE',
                'start_at' => now()->addDays(30)->setTime(12, 0),
                'end_at' => now()->addDays(32)->setTime(23, 0),
                'image_url' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
                'status' => 'published',
            ],
            [
                'type' => 'concert',
                'title' => 'Narodnjaci Live - Abu Dhabi Edition',
                'description' => 'Najbolji narodnjaci uživo u Abu Dhabiju! Specijalni gosti iz Srbije i Hrvatske.',
                'venue' => 'Yas Island',
                'address' => 'Yas Marina',
                'city' => 'Abu Dhabi',
                'country' => 'UAE',
                'start_at' => now()->addDays(45)->setTime(20, 0),
                'end_at' => now()->addDays(46)->setTime(2, 0),
                'image_url' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
                'status' => 'published',
            ],
            [
                'type' => 'family',
                'title' => 'Porodični Piknik - Al Barsha Park',
                'description' => 'Mjesečno okupljanje porodica iz regiona. Igre za djecu, roštilj i druženje. Svi su dobrodošli!',
                'venue' => 'Al Barsha Pond Park',
                'address' => 'Al Barsha',
                'city' => 'Dubai',
                'country' => 'UAE',
                'start_at' => now()->addDays(5)->setTime(10, 0),
                'end_at' => now()->addDays(5)->setTime(18, 0),
                'image_url' => 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
                'status' => 'published',
            ],
            [
                'type' => 'workshop',
                'title' => 'Workshop: Kako Otvoriti Biznis u UAE',
                'description' => 'Praktični workshop za sve koji planiraju pokrenuti vlastiti biznis u Emiratima. Saznajte sve o vizama, licencama i porezima.',
                'venue' => 'Business Bay',
                'address' => 'Churchill Towers',
                'city' => 'Dubai',
                'country' => 'UAE',
                'start_at' => now()->addDays(12)->setTime(14, 0),
                'end_at' => now()->addDays(12)->setTime(17, 0),
                'image_url' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
                'status' => 'published',
            ],
        ];

        foreach ($events as $eventData) {
            Event::create(array_merge($eventData, [
                'organizer_id' => $organizer->id,
                'slug' => Str::slug($eventData['title']) . '-' . Str::random(5),
            ]));
        }

        $this->command->info('✅ Created ' . count($events) . ' sample events!');
    }
}
