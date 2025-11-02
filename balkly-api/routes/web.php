<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Balkly API',
        'version' => '1.0.0',
        'status' => 'online',
        'documentation' => '/api/v1/docs'
    ]);
});

