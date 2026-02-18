<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerClick extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'partner_id', 'user_id', 'ip_address',
        'user_agent', 'referrer_url', 'landing_url',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
