<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class KbArticle extends Model
{
    use Searchable;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'content',
        'video_url',
        'video_duration',
        'related_articles',
        'helpful_count',
        'not_helpful_count',
        'views_count',
        'display_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'related_articles' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(KbCategory::class, 'category_id');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}

