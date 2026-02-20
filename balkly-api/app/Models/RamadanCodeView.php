<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RamadanCodeView extends Model
{
    protected $table = 'ramadan_code_views';

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
