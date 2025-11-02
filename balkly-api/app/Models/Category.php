<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'slug',
        'name',
        'icon',
        'description',
        'schema_preset',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'schema_preset' => 'array',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('order');
    }

    public function attributes()
    {
        return $this->hasMany(Attribute::class)->orderBy('order');
    }

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }
}

