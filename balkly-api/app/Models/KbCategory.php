<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KbCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'display_order',
    ];

    public function articles()
    {
        return $this->hasMany(KbArticle::class, 'category_id')
                    ->orderBy('display_order');
    }
}

