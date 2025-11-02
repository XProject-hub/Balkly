<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'description',
        'price',
        'currency',
        'capacity',
        'sold',
        'reserved',
        'sale_starts_at',
        'sale_ends_at',
        'is_active',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
            'sale_starts_at' => 'datetime',
            'sale_ends_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function ticketOrders()
    {
        return $this->hasMany(TicketOrder::class);
    }

    public function qrCodes()
    {
        return $this->hasMany(TicketQRCode::class);
    }

    public function isAvailable()
    {
        if (!$this->is_active) return false;
        if ($this->capacity && ($this->sold + $this->reserved) >= $this->capacity) return false;
        if ($this->sale_starts_at && now()->lt($this->sale_starts_at)) return false;
        if ($this->sale_ends_at && now()->gt($this->sale_ends_at)) return false;
        return true;
    }
}

