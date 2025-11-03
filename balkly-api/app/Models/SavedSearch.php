<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedSearch extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'search_params',
        'alert_enabled',
        'alert_frequency',
        'last_alerted_at',
    ];

    protected function casts(): array
    {
        return [
            'search_params' => 'array',
            'alert_enabled' => 'boolean',
            'last_alerted_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

