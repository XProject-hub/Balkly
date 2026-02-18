<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Partner extends Model
{
    protected $fillable = [
        'user_id', 'company_name', 'company_logo', 'company_description',
        'website_url', 'address', 'city', 'country', 'phone', 'contact_email',
        'commission_type', 'commission_rate',
        'default_voucher_duration_hours', 'default_voucher_duration_days',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'commission_rate' => 'decimal:2',
            'is_active' => 'boolean',
            'default_voucher_duration_hours' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Partner $partner) {
            if (empty($partner->tracking_code)) {
                $partner->tracking_code = self::generateTrackingCode();
            }
        });
    }

    public static function generateTrackingCode(): string
    {
        do {
            $code = strtolower(Str::random(12));
        } while (self::where('tracking_code', $code)->exists());

        return $code;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function staff()
    {
        return $this->hasMany(PartnerStaff::class);
    }

    public function offers()
    {
        return $this->hasMany(PartnerOffer::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }

    public function redemptions()
    {
        return $this->hasMany(Redemption::class);
    }

    public function clicks()
    {
        return $this->hasMany(PartnerClick::class);
    }

    public function conversions()
    {
        return $this->hasMany(PartnerConversion::class);
    }

    public function calculateCommission(float $amount): float
    {
        return match ($this->commission_type) {
            'percent_of_bill' => round($amount * $this->commission_rate / 100, 2),
            'fixed_per_client' => (float) $this->commission_rate,
            'digital_referral_percent' => round($amount * $this->commission_rate / 100, 2),
            default => 0,
        };
    }
}
