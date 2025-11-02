<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'event_id',
        'order_id',
        'order_number',
        'total',
        'currency',
        'status',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function qrCodes()
    {
        return $this->hasMany(TicketQRCode::class);
    }
}

