<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    protected $fillable = [
        'subject', 'content', 'sent_by', 'recipients_count', 'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function sentByUser()
    {
        return $this->belongsTo(User::class, 'sent_by');
    }
}
