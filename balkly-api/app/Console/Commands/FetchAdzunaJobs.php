<?php

namespace App\Console\Commands;

use App\Models\Job;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FetchAdzunaJobs extends Command
{
    protected $signature = 'jobs:fetch {--pages=3 : Number of pages to fetch}';
    protected $description = 'Fetch jobs from JSearch API for Dubai and save to database';

    private $apiKey = 'bf633bda44msh714ad394a53051bp1c9008jsn29f45e8b387e';
    private $apiHost = 'jsearch.p.rapidapi.com';

    public function handle()
    {
        $this->info('💼 Fetching jobs from JSearch API for Dubai...');

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
                    $externalId = $jobData['job_id'] ?? md5($jobData['job_title'] . $jobData['employer_name']);
                    $existingJob = Job::where('external_id', $externalId)->first();
                    
                    if ($existingJob) {
                        // Update existing job
                        $existingJob->update($this->mapJobData($jobData));
                        $this->line("↻ Updated: {$jobData['job_title']}");
                    } else {
                        // Create new job
                        Job::create($this->mapJobData($jobData));
                        $newJobs++;
                        $this->info("✓ Added: {$jobData['job_title']}");
                    }
                }

                // Respect rate limits (RapidAPI)
                sleep(2);
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
            Log::error('JSearch fetch error: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Fetch a page of jobs from JSearch API
     */
    private function fetchJobsPage(int $page): array
    {
        $response = Http::timeout(30)
            ->withHeaders([
                'x-rapidapi-host' => $this->apiHost,
                'x-rapidapi-key' => $this->apiKey,
            ])
            ->get('https://jsearch.p.rapidapi.com/search', [
                'query' => 'jobs in Dubai UAE',
                'page' => $page,
                'num_pages' => 1,
                'date_posted' => 'month',
            ]);

        if (!$response->successful()) {
            $this->error("API error: " . $response->status() . " - " . $response->body());
            return [];
        }

        $data = $response->json();
        
        return $data['data'] ?? [];
    }

    /**
     * Map JSearch job data to our Job model
     */
    private function mapJobData(array $jobData): array
    {
        // Extract city from location
        $city = $jobData['job_city'] ?? 'Dubai';
        $location = $jobData['job_city'] ?? '';
        if (!empty($jobData['job_state'])) {
            $location .= ', ' . $jobData['job_state'];
        }
        if (!empty($jobData['job_country'])) {
            $location .= ', ' . $jobData['job_country'];
        }

        // Parse salary
        $salaryMin = null;
        $salaryMax = null;
        $salaryCurrency = 'AED';
        
        if (!empty($jobData['job_min_salary'])) {
            $salaryMin = (float) $jobData['job_min_salary'];
        }
        if (!empty($jobData['job_max_salary'])) {
            $salaryMax = (float) $jobData['job_max_salary'];
        }
        if (!empty($jobData['job_salary_currency'])) {
            $salaryCurrency = $jobData['job_salary_currency'];
        }

        return [
            'external_id' => $jobData['job_id'] ?? md5($jobData['job_title'] . ($jobData['employer_name'] ?? '')),
            'title' => $jobData['job_title'] ?? 'Untitled Position',
            'description' => $this->cleanDescription($jobData['job_description'] ?? ''),
            'company' => $jobData['employer_name'] ?? 'Company',
            'location' => trim($location) ?: 'Dubai, UAE',
            'city' => $city ?: 'Dubai',
            'country' => 'AE',
            'salary_min' => $salaryMin,
            'salary_max' => $salaryMax,
            'salary_currency' => $salaryCurrency,
            'category' => $jobData['job_employment_type'] ?? 'FULLTIME',
            'contract_type' => $jobData['job_employment_type'] ?? null,
            'contract_time' => $jobData['job_is_remote'] ? 'remote' : 'onsite',
            'redirect_url' => $jobData['job_apply_link'] ?? '',
            'source' => 'jsearch',
            'employer_logo' => $jobData['employer_logo'] ?? null,
            'created_date' => isset($jobData['job_posted_at_datetime_utc']) 
                ? \Carbon\Carbon::parse($jobData['job_posted_at_datetime_utc']) 
                : now(),
            'status' => 'active',
            'metadata' => [
                'employer_logo' => $jobData['employer_logo'] ?? null,
                'employer_website' => $jobData['employer_website'] ?? null,
                'job_publisher' => $jobData['job_publisher'] ?? null,
                'job_highlights' => $jobData['job_highlights'] ?? null,
                'is_remote' => $jobData['job_is_remote'] ?? false,
                'required_experience' => $jobData['job_required_experience'] ?? null,
                'required_skills' => $jobData['job_required_skills'] ?? null,
            ],
        ];
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
