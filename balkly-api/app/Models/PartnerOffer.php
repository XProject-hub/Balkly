<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerOffer extends Model
{
    protected $fillable = [
        'partner_id', 'title', 'description', 'benefit_type',
        'benefit_value', 'min_purchase', 'terms', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'benefit_value' => 'decimal:2',
            'min_purchase' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class, 'offer_id');
    }
}
