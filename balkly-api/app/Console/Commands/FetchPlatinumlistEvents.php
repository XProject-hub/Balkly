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
            // Fetch XML feed from Platinumlist
            $xmlUrl = 'https://bit.ly/pl_events';
            $response = Http::get($xmlUrl);

            if (!$response->successful()) {
                $this->error('Failed to fetch XML feed');
                return 1;
            }

            // Parse XML
            $xml = simplexml_load_string($response->body());
            
            if (!$xml) {
                $this->error('Failed to parse XML');
                return 1;
            }

            $count = 0;
            $affiliate_ref = 'zjblytn';

            // Process each event from XML
            foreach ($xml->event as $xmlEvent) {
                // Generate affiliate link
                $eventUrl = (string)$xmlEvent->url;
                $affiliateLink = "https://platinumlist.net/aff/?ref={$affiliate_ref}&link=" . urlencode($eventUrl);

                // Check if event already exists
                $existingEvent = Event::where('partner_ref', $affiliate_ref)
                    ->where('partner_url', $affiliateLink)
                    ->first();

                if ($existingEvent) {
                    $this->line("Skipping existing: {$xmlEvent->title}");
                    continue;
                }

                // Create new affiliate event
                Event::create([
                    'organizer_id' => 1, // System user
                    'type' => 'affiliate',
                    'title' => (string)$xmlEvent->title,
                    'slug' => Str::slug((string)$xmlEvent->title) . '-' . Str::random(8),
                    'description' => (string)$xmlEvent->description ?? null,
                    'venue' => (string)$xmlEvent->venue ?? null,
                    'city' => (string)$xmlEvent->city ?? 'Dubai',
                    'country' => 'AE',
                    'start_at' => $xmlEvent->start_date ? date('Y-m-d H:i:s', strtotime((string)$xmlEvent->start_date)) : now(),
                    'end_at' => $xmlEvent->end_date ? date('Y-m-d H:i:s', strtotime((string)$xmlEvent->end_date)) : null,
                    'partner_url' => $affiliateLink,
                    'partner_ref' => $affiliate_ref,
                    'image_url' => (string)$xmlEvent->image_url ?? null,
                    'status' => 'published',
                    'metadata' => [
                        'source' => 'platinumlist',
                        'original_url' => $eventUrl,
                        'category' => (string)$xmlEvent->category ?? null,
                        'price' => isset($xmlEvent->price) ? [
                            'min' => (float)$xmlEvent->price->min ?? 0,
                            'max' => (float)$xmlEvent->price->max ?? null,
                            'currency' => (string)$xmlEvent->price->currency ?? 'AED',
                        ] : null,
                    ],
                ]);

                $count++;
                $this->info("✓ Added: {$xmlEvent->title}");
            }

            $this->info("✅ Successfully imported {$count} events from Platinumlist");
            return 0;

        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return 1;
        }
    }
}

