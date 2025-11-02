<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'invoice_number',
        'pdf_url',
        'vat_country',
        'vat_rate',
        'totals_json',
        'billing_details',
        'issued_at',
    ];

    protected function casts(): array
    {
        return [
            'vat_rate' => 'decimal:2',
            'totals_json' => 'array',
            'billing_details' => 'array',
            'issued_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}

