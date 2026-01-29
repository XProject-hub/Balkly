<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KBArticle extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kb_articles';

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

    protected $casts = [
        'published_at' => 'datetime',
        'views_count' => 'integer',
        'is_helpful_count' => 'integer',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(KBCategory::class, 'category_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
