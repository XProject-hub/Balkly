<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class ForumTopic extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $fillable = [
        'category_id',
        'subcategory_id',
        'user_id',
        'title',
        'slug',
        'content',
        'is_sticky',
        'sticky_until',
        'is_locked',
        'views_count',
        'replies_count',
        'last_post_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'is_sticky' => 'boolean',
            'is_locked' => 'boolean',
            'sticky_until' => 'datetime',
            'last_post_at' => 'datetime',
        ];
    }

    public function category()
    {
        return $this->belongsTo(ForumCategory::class, 'category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function posts()
    {
        return $this->hasMany(ForumPost::class, 'topic_id');
    }

    public function scopeSticky($query)
    {
        return $query->where('is_sticky', true)
                     ->where(function($q) {
                         $q->whereNull('sticky_until')
                           ->orWhere('sticky_until', '>', now());
                     });
    }
}

