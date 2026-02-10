<?php

namespace App\Console\Commands;

use App\Models\Job;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FetchAdzunaJobs extends Command
{
    protected $signature = 'adzuna:fetch {--pages=3 : Number of pages to fetch}';
    protected $description = 'Fetch jobs from Adzuna API for UAE and save to database';

    private $appId = '43fb74ce';
    private $appKey = '5eab69101b3437b5c976135bcc39c3ad';

    public function handle()
    {
        $this->info('💼 Fetching jobs from Adzuna API...');

        $pages = (int) $this->option('pages');
        $totalJobs = 0;
        $newJobs = 0;

        try {
            for ($page = 1; $page <= $pages; $page++) {
                $this->info("📄 Fetching page {$page}...");
                
                $jobs = $this->fetchJobsPage($page);
                
                if (empty($jobs)) {
                    $this->warn("No jobs found on page {$page}");
                    continue;
                }

                foreach ($jobs as $jobData) {
                    $totalJobs++;
                    
                    // Check if job already exists
                    $existingJob = Job::where('external_id', $jobData['id'])->first();
                    
                    if ($existingJob) {
                        // Update existing job
                        $existingJob->update($this->mapJobData($jobData));
                        $this->line("↻ Updated: {$jobData['title']}");
                    } else {
                        // Create new job
                        Job::create($this->mapJobData($jobData));
                        $newJobs++;
                        $this->info("✓ Added: {$jobData['title']}");
                    }
                }

                // Respect rate limits
                sleep(1);
            }

            // Clean up old jobs (older than 30 days)
            $deleted = Job::where('created_date', '<', now()->subDays(30))->delete();
            if ($deleted > 0) {
                $this->info("🗑️ Cleaned up {$deleted} old jobs");
            }

            $this->info("✅ Finished! Processed {$totalJobs} jobs, added {$newJobs} new jobs");
            return 0;

        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            Log::error('Adzuna fetch error: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Fetch a page of jobs from Adzuna API
     */
    private function fetchJobsPage(int $page): array
    {
        $url = "https://api.adzuna.com/v1/api/jobs/ae/search/{$page}";
        
        $response = Http::timeout(30)->get($url, [
            'app_id' => $this->appId,
            'app_key' => $this->appKey,
            'results_per_page' => 50,
            'what' => '', // All jobs
            'sort_by' => 'date',
            'max_days_old' => 30,
        ]);

        if (!$response->successful()) {
            $this->error("API error: " . $response->status());
            return [];
        }

        $data = $response->json();
        
        return $data['results'] ?? [];
    }

    /**
     * Map Adzuna job data to our Job model
     */
    private function mapJobData(array $jobData): array
    {
        // Extract city from location
        $location = $jobData['location']['display_name'] ?? '';
        $city = $this->extractCity($location);

        return [
            'external_id' => (string) $jobData['id'],
            'title' => $jobData['title'] ?? 'Untitled Position',
            'description' => $this->cleanDescription($jobData['description'] ?? ''),
            'company' => $jobData['company']['display_name'] ?? 'Company',
            'location' => $location,
            'city' => $city,
            'country' => 'AE',
            'salary_min' => $jobData['salary_min'] ?? null,
            'salary_max' => $jobData['salary_max'] ?? null,
            'salary_currency' => 'AED',
            'category' => $jobData['category']['label'] ?? 'General',
            'contract_type' => $jobData['contract_type'] ?? null,
            'contract_time' => $jobData['contract_time'] ?? null,
            'redirect_url' => $jobData['redirect_url'] ?? '',
            'source' => 'adzuna',
            'created_date' => isset($jobData['created']) ? \Carbon\Carbon::parse($jobData['created']) : now(),
            'status' => 'active',
            'metadata' => [
                'latitude' => $jobData['latitude'] ?? null,
                'longitude' => $jobData['longitude'] ?? null,
                'category_tag' => $jobData['category']['tag'] ?? null,
                'adref' => $jobData['adref'] ?? null,
            ],
        ];
    }

    /**
     * Extract city name from location string
     */
    private function extractCity(string $location): string
    {
        $cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Al Ain'];
        
        foreach ($cities as $city) {
            if (stripos($location, $city) !== false) {
                return $city;
            }
        }
        
        // Default to first part of location
        $parts = explode(',', $location);
        return trim($parts[0]) ?: 'Dubai';
    }

    /**
     * Clean up job description
     */
    private function cleanDescription(string $description): string
    {
        // Remove HTML tags
        $description = strip_tags($description);
        
        // Decode HTML entities
        $description = html_entity_decode($description);
        
        // Limit length
        if (strlen($description) > 2000) {
            $description = substr($description, 0, 1997) . '...';
        }
        
        return trim($description);
    }
}
