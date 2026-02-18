<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerStaff extends Model
{
    protected $table = 'partner_staff';

    protected $fillable = [
        'partner_id', 'user_id', 'role', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
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
