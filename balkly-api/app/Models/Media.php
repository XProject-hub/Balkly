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
        'mediable_type',
        'mediable_id',
        'file_name',
        'file_path',
        'url',
        'type',
        'mime_type',
        'size',
        'order',
        'collection_name',
        'ai_tags_json',
        'metadata',
    ];
    
    protected $appends = ['url'];

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
    
    public function mediable()
    {
        return $this->morphTo('mediable', 'mediable_type', 'mediable_id');
    }
    
    /**
     * Get full URL for the media file
     */
    public function getUrlAttribute()
    {
        if ($this->attributes['url'] ?? null) {
            return $this->attributes['url'];
        }
        
        if ($this->file_path) {
            return url('storage/' . $this->file_path);
        }
        
        return null;
    }
}

