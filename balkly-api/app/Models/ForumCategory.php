<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'description',
        'icon',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function parent()
    {
        return $this->belongsTo(ForumCategory::class, 'parent_id');
    }

    public function subcategories()
    {
        return $this->hasMany(ForumCategory::class, 'parent_id')->orderBy('order');
    }

    public function topics()
    {
        return $this->hasMany(ForumTopic::class, 'category_id');
    }
}

