<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Redemption extends Model
{
    protected $fillable = [
        'voucher_id', 'staff_id', 'partner_id',
        'amount', 'benefit_type', 'benefit_applied',
        'notes', 'ip_address', 'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }
}
