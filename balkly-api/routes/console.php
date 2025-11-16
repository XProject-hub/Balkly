<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('horizon:snapshot')->everyFiveMinutes();

// Fetch Platinumlist events every 2 hours
Schedule::command('platinumlist:fetch')->everyTwoHours();

