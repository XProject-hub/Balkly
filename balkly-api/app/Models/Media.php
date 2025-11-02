<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_type',
        'owner_id',
        'url',
        'type',
        'mime_type',
        'size',
        'order',
        'ai_tags_json',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'ai_tags_json' => 'array',
            'metadata' => 'array',
        ];
    }

    public function owner()
    {
        return $this->morphTo();
    }
}

