<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'type',
        'options_json',
        'is_required',
        'is_searchable',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'options_json' => 'array',
            'is_required' => 'boolean',
            'is_searchable' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function listingAttributes()
    {
        return $this->hasMany(ListingAttribute::class);
    }
}

