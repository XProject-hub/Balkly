<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Voucher extends Model
{
    protected $fillable = [
        'partner_id', 'offer_id', 'user_id',
        'status', 'expires_at', 'redeemed_at', 'redeemed_by',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'redeemed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Voucher $voucher) {
            if (empty($voucher->code)) {
                $voucher->code = self::generateCode();
            }
        });
    }

    public static function generateCode(): string
    {
        do {
            $code = 'BLK-' . strtoupper(Str::random(6));
        } while (self::where('code', $code)->exists());

        return $code;
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isRedeemable(): bool
    {
        return $this->status === 'issued' && $this->expires_at && !$this->expires_at->isPast();
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function offer()
    {
        return $this->belongsTo(PartnerOffer::class, 'offer_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function redeemedByUser()
    {
        return $this->belongsTo(User::class, 'redeemed_by');
    }

    public function redemption()
    {
        return $this->hasOne(Redemption::class);
    }
}
