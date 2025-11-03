<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageVisit extends Model
{
    protected $fillable = [
        'user_id',
        'page_url',
        'page_title',
        'referrer',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'time_on_page',
        'visited_at',
    ];

    protected function casts(): array
    {
        return [
            'visited_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

