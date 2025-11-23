<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'link',
        'icon',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }
    
    /**
     * Check if notification is read
     */
    public function getIsReadAttribute()
    {
        return !is_null($this->read_at);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    /**
     * Mark as read
     */
    public function markAsRead()
    {
        if (is_null($this->read_at)) {
            $this->update([
                'read_at' => now(),
            ]);
        }
    }
}

