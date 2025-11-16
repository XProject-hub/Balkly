<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KBCategory extends Model
{
    use HasFactory;

    protected $table = 'kb_categories';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationships
    public function articles()
    {
        return $this->hasMany(KBArticle::class, 'category_id');
    }
}
