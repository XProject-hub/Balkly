<?php

return [
    /*
    |--------------------------------------------------------------------------
    | WebSocket Dashboard
    |--------------------------------------------------------------------------
    */
    'dashboard' => [
        'port' => env('LARAVEL_WEBSOCKETS_PORT', 6001),
    ],

    /*
    |--------------------------------------------------------------------------
    | WebSocket Apps
    |--------------------------------------------------------------------------
    */
    'apps' => [
        [
            'id' => env('PUSHER_APP_ID', 'balkly'),
            'name' => env('APP_NAME', 'Balkly'),
            'key' => env('PUSHER_APP_KEY', 'balkly_key'),
            'secret' => env('PUSHER_APP_SECRET', 'balkly_secret'),
            'path' => env('PUSHER_APP_PATH'),
            'capacity' => null,
            'enable_client_messages' => true,
            'enable_statistics' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Class Bindings
    |--------------------------------------------------------------------------
    */
    'app_provider' => BeyondCode\LaravelWebSockets\Apps\ConfigAppProvider::class,
    'channel_manager' => BeyondCode\LaravelWebSockets\WebSockets\Channels\ChannelManagers\ArrayChannelManager::class,
    'statistics_store' => BeyondCode\LaravelWebSockets\Statistics\DnsStatisticsStore::class,

    /*
    |--------------------------------------------------------------------------
    | SSL Configuration
    |--------------------------------------------------------------------------
    */
    'ssl' => [
        'local_cert' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT', null),
        'local_pk' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_PK', null),
        'passphrase' => env('LARAVEL_WEBSOCKETS_SSL_PASSPHRASE', null),
    ],

    /*
    |--------------------------------------------------------------------------
    | Channel Manager
    |--------------------------------------------------------------------------
    */
    'replication' => [
        'mode' => env('WEBSOCKETS_REPLICATION_MODE', 'local'),
    ],
];

