<?php

namespace App\Console\Commands;

use App\Models\Event;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Carbon\Carbon;

class FetchPlatinumlistEventsAPI extends Command
{
    protected $signature = 'platinumlist:fetch-api';
    protected $description = 'Fetch events from Platinumlist API v7';

    public function handle()
    {
        $this->info('🎪 Fetching events from Platinumlist API v7...');

        try {
            $apiKey = env('PLATINUMLIST_API_KEY');
            $baseUrl = 'https://api.platinumlist.net/v/7/events';
            $affiliate_ref = env('PLATINUMLIST_AFFILIATE_REF', 'zjblytn');
            
            $page = 1;
            $totalImported = 0;
            $perPage = 100;

            do {
                $this->info("Fetching page {$page}...");
                
                $response = Http::withHeaders([
                    'Api-Key' => $apiKey,
                    'Accept' => 'application/json',
                    'price_scope' => 'price',
                ])->get($baseUrl, [
                    'scope' => 'affiliate.show.events',
                    'include' => 'price',
                    'per_page' => $perPage,
                    'page' => $page,
                ]);

                if (!$response->successful()) {
                    $this->error("API request failed: " . $response->status());
                    break;
                }

                $data = $response->json();
                $events = $data['data'] ?? [];
                
                if (empty($events)) {
                    break;
                }

                foreach ($events as $eventData) {
                    // Only UAE events
                    $url = $eventData['url'] ?? '';
                    if (!str_contains($url, '.ae') && 
                        !str_contains($url, 'dubai') && 
                        !str_contains($url, 'abu-dhabi') && 
                        !str_contains($url, 'sharjah')) {
                        continue;
                    }

                    $affiliateLink = $url . '?ref=' . $affiliate_ref;
                    
                    // Check if exists
                    $existing = Event::where('partner_url', $affiliateLink)->first();
                    if ($existing) {
                        continue;
                    }

                    // Parse timestamps
                    $startDate = isset($eventData['start']) ? 
                        Carbon::createFromTimestamp($eventData['start']) : now()->addDay();
                    $endDate = isset($eventData['end']) ? 
                        Carbon::createFromTimestamp($eventData['end']) : $startDate->copy()->addMonth();

                    // Extract city from URL or default
                    $city = $this->extractCity($url);

                    // Get image
                    $imageUrl = $eventData['image_big']['src'] ?? 
                                $eventData['image_medium']['src'] ?? 
                                $eventData['image_small']['src'] ?? null;

                    // Get price
                    $price = $eventData['price']['data']['price'] ?? 0;
                    $currency = $eventData['price']['data']['currency'] ?? 'AED';

                    // Create event
                    Event::create([
                        'organizer_id' => 1,
                        'type' => 'affiliate',
                        'title' => $eventData['name'],
                        'slug' => Str::slug($eventData['name']) . '-' . Str::random(8),
                        'description' => strip_tags($eventData['description'] ?? ''),
                        'venue' => $eventData['venue'] ?? '',
                        'city' => $city,
                        'country' => 'AE',
                        'start_at' => $startDate,
                        'end_at' => $endDate,
                        'partner_url' => $affiliateLink,
                        'partner_ref' => $affiliate_ref,
                        'image_url' => $imageUrl,
                        'status' => 'published',
                        'metadata' => json_encode([
                            'source' => 'platinumlist_api',
                            'event_id' => $eventData['id'],
                            'rating' => $eventData['rating'] ?? 0,
                            'price' => $price,
                            'currency' => $currency,
                            'is_attraction' => $eventData['is_attraction'] ?? false,
                            'timezone' => $eventData['timezone'] ?? 'Asia/Dubai',
                        ]),
                    ]);

                    $totalImported++;
                    $this->info("✓ Imported: " . $eventData['name']);
                }

                $totalPages = $data['meta']['pagination']['total_pages'] ?? 1;
                $page++;
                
            } while ($page <= min($totalPages, 15)); // Limit to 15 pages (1500 events max)

            $this->info("✅ Successfully imported {$totalImported} events from Platinumlist API");
            return 0;

        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }
    }

    private function extractCity($url)
    {
        if (str_contains($url, 'dubai')) return 'Dubai';
        if (str_contains($url, 'abu-dhabi')) return 'Abu Dhabi';
        if (str_contains($url, 'sharjah')) return 'Sharjah';
        if (str_contains($url, 'ajman')) return 'Ajman';
        if (str_contains($url, 'ras-al-khaimah') || str_contains($url, 'rak')) return 'Ras Al Khaimah';
        if (str_contains($url, 'al-ain')) return 'Al Ain';
        return 'Dubai';
    }
}

