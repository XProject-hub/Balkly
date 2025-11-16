<?php

namespace App\Console\Commands;

use App\Models\Event;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class FetchPlatinumlistEvents extends Command
{
    protected $signature = 'platinumlist:fetch';
    protected $description = 'Fetch events from Platinumlist XML feed and save as affiliate events';

    public function handle()
    {
        $this->info('🎪 Fetching events from Platinumlist...');

        try {
            // For now, use the predefined attraction landing pages
            // When XML feed becomes available, this can be updated
            $events = $this->getPredefinedEvents();

            if (empty($events)) {
                $this->error('No events to import');
                return 1;
            }

            $count = 0;

            // Process each event
            foreach ($events as $event) {
                // Check if event already exists by URL
                $existingEvent = Event::where('partner_url', $event['partner_url'])->first();

                if ($existingEvent) {
                    $this->line("Skipping existing: {$event['title']}");
                    continue;
                }

                // Create new affiliate event
                Event::create($event);

                $count++;
                $this->info("✓ Added: {$event['title']}");
            }

            $this->info("✅ Successfully imported {$count} events from Platinumlist");
            return 0;

        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Get predefined Platinumlist attraction events
     * Based on: https://bit.ly/attractions-landings
     */
    private function getPredefinedEvents()
    {
        $affiliate_ref = 'zjblytn';
        $systemUserId = 1; // Or get admin user

        $attractions = [
            [
                'title' => 'Burj Khalifa - At The Top Experience',
                'url' => 'https://burj-khalifa.platinumlist.net',
                'description' => 'Visit the world\'s tallest building! Experience breathtaking 360-degree views from levels 124 & 125.',
                'image_url' => 'https://cdn.pixabay.com/photo/2020/02/03/00/12/burj-khalifa-4814842_1280.jpg',
                'venue' => 'Burj Khalifa',
                'city' => 'Dubai',
                'category' => 'Attractions',
                'price_min' => 149,
                'price_max' => 379,
            ],
            [
                'title' => 'Skydive Dubai - Tandem Jump',
                'url' => 'https://skydive.platinumlist.net',
                'description' => 'Experience the thrill of a lifetime! Jump from 13,000 feet over Palm Jumeirah.',
                'image_url' => 'https://cdn.pixabay.com/photo/2016/11/29/13/15/aircraft-1870374_1280.jpg',
                'venue' => 'Skydive Dubai',
                'city' => 'Dubai',
                'category' => 'Adventure',
                'price_min' => 1699,
                'price_max' => 2199,
            ],
            [
                'title' => 'Atlantis Aquaventure Waterpark',
                'url' => 'https://altantiswaterpark.platinumlist.net',
                'description' => 'Middle East\'s #1 waterpark! Thrilling slides, private beach, underwater adventures.',
                'image_url' => 'https://cdn.pixabay.com/photo/2020/02/08/14/29/atlantis-4829924_1280.jpg',
                'venue' => 'Atlantis The Palm',
                'city' => 'Dubai',
                'category' => 'Water Parks',
                'price_min' => 299,
                'price_max' => 399,
            ],
            [
                'title' => 'IMG Worlds of Adventure',
                'url' => 'https://imgworld.platinumlist.net',
                'description' => 'World\'s largest indoor theme park! Marvel Super Heroes, Cartoon Network, thrilling rides.',
                'image_url' => 'https://cdn.pixabay.com/photo/2017/11/12/13/28/amusement-park-2943408_1280.jpg',
                'venue' => 'IMG Worlds',
                'city' => 'Dubai',
                'category' => 'Theme Parks',
                'price_min' => 295,
                'price_max' => 345,
            ],
            [
                'title' => 'Guided Tours Inside Burj Al Arab',
                'url' => 'https://burjalarab.platinumlist.net',
                'description' => 'Exclusive inside access to the world\'s most luxurious hotel!',
                'image_url' => 'https://cdn.pixabay.com/photo/2020/02/02/17/24/travel-4813658_1280.jpg',
                'venue' => 'Burj Al Arab',
                'city' => 'Dubai',
                'category' => 'Tours',
                'price_min' => 399,
                'price_max' => 599,
            ],
            [
                'title' => 'Dubai Safari Park',
                'url' => 'https://dubaisafaripark.platinumlist.net',
                'description' => 'Explore wildlife! 3,000+ animals across African, Asian, and Arabian villages.',
                'image_url' => 'https://cdn.pixabay.com/photo/2019/07/14/16/27/safari-4337394_1280.jpg',
                'venue' => 'Dubai Safari Park',
                'city' => 'Dubai',
                'category' => 'Wildlife',
                'price_min' => 50,
                'price_max' => 85,
            ],
            [
                'title' => 'Dubai Frame - Sky Bridge & Gallery',
                'url' => 'https://dubaiframe.platinumlist.net',
                'description' => 'Walk the 150m high Sky Bridge! Stunning views of old and new Dubai.',
                'image_url' => 'https://cdn.pixabay.com/photo/2020/02/16/20/30/dubai-frame-4854718_1280.jpg',
                'venue' => 'Dubai Frame',
                'city' => 'Dubai',
                'category' => 'Landmarks',
                'price_min' => 50,
                'price_max' => 50,
            ],
            [
                'title' => 'Ski Dubai - Snow Park & Skiing',
                'url' => 'https://skidubai.platinumlist.net',
                'description' => 'Ski in the desert! Indoor snow park with 5 ski runs and penguin encounters.',
                'image_url' => 'https://cdn.pixabay.com/photo/2016/02/07/14/08/ski-1184065_1280.jpg',
                'venue' => 'Mall of the Emirates',
                'city' => 'Dubai',
                'category' => 'Indoor Activities',
                'price_min' => 180,
                'price_max' => 450,
            ],
        ];

        $events = [];
        foreach ($attractions as $attr) {
            $affiliateLink = "https://platinumlist.net/aff/?ref={$affiliate_ref}&link=" . urlencode($attr['url']);
            
            $events[] = [
                'organizer_id' => $systemUserId,
                'type' => 'affiliate',
                'title' => $attr['title'],
                'slug' => Str::slug($attr['title']) . '-' . Str::random(8),
                'description' => $attr['description'],
                'venue' => $attr['venue'],
                'city' => $attr['city'],
                'country' => 'AE',
                'start_at' => now()->addDay(), // Start tomorrow so it shows as "upcoming"
                'end_at' => now()->addYear(),
                'partner_url' => $affiliateLink,
                'partner_ref' => $affiliate_ref,
                'image_url' => $attr['image_url'],
                'status' => 'published',
                'metadata' => json_encode([
                    'source' => 'platinumlist',
                    'original_url' => $attr['url'],
                    'category' => $attr['category'],
                    'price' => [
                        'min' => $attr['price_min'],
                        'max' => $attr['price_max'],
                        'currency' => 'AED',
                    ],
                ]),
            ];
        }

        return $events;
    }
}

