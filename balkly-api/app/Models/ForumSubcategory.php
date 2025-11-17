<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumSubcategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'forum_category_id',
        'name',
        'slug',
        'description',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(ForumCategory::class, 'forum_category_id');
    }

    public function topics()
    {
        return $this->hasMany(ForumTopic::class, 'subcategory_id');
    }
}

