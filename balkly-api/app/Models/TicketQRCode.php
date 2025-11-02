<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketQRCode extends Model
{
    use HasFactory;

    protected $table = 'ticket_qr_codes';

    protected $fillable = [
        'ticket_order_id',
        'ticket_id',
        'code',
        'qr_url',
        'status',
        'issued_at',
        'used_at',
        'scanned_by',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
            'used_at' => 'datetime',
        ];
    }

    public function ticketOrder()
    {
        return $this->belongsTo(TicketOrder::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function scanner()
    {
        return $this->belongsTo(User::class, 'scanned_by');
    }
}

