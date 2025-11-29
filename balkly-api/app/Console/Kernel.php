<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Fetch Platinumlist events every 6 hours
        $schedule->command('platinumlist:fetch')
            ->everySixHours()
            ->withoutOverlapping()
            ->runInBackground();
        
        // Clean up old events (ended more than 30 days ago)
        $schedule->call(function () {
            \App\Models\Event::where('type', 'affiliate')
                ->where('end_at', '<', now()->subDays(30))
                ->delete();
        })->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}

