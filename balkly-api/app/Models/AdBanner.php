<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdBanner extends Model
{
    protected $fillable = [
        'name',
        'position',
        'type',
        'image_url',
        'html_content',
        'link_url',
        'open_new_tab',
        'display_order',
        'start_date',
        'end_date',
        'is_active',
        'impressions',
        'clicks',
        'targeting',
    ];

    protected function casts(): array
    {
        return [
            'open_new_tab' => 'boolean',
            'is_active' => 'boolean',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'targeting' => 'array',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where(function($q) {
                         $q->whereNull('start_date')->orWhere('start_date', '<=', now());
                     })
                     ->where(function($q) {
                         $q->whereNull('end_date')->orWhere('end_date', '>=', now());
                     });
    }

    public function incrementImpressions()
    {
        $this->increment('impressions');
    }

    public function incrementClicks()
    {
        $this->increment('clicks');
    }
}

