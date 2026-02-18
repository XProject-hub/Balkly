<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerConversion extends Model
{
    protected $fillable = [
        'partner_id', 'voucher_id', 'click_id', 'type',
        'amount', 'commission_rate', 'commission_amount',
        'status', 'notes', 'confirmed_at', 'confirmed_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'confirmed_at' => 'datetime',
        ];
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function click()
    {
        return $this->belongsTo(PartnerClick::class, 'click_id');
    }

    public function confirmedByUser()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}
