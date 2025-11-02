<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Event extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $fillable = [
        'organizer_id',
        'type',
        'title',
        'slug',
        'description',
        'venue',
        'address',
        'city',
        'country',
        'location_geo',
        'start_at',
        'end_at',
        'partner_ref',
        'partner_url',
        'image_url',
        'status',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function ticketOrders()
    {
        return $this->hasMany(TicketOrder::class);
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'owner');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_at', '>', now());
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}

