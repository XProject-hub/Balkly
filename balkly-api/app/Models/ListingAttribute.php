<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListingAttribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'attribute_id',
        'value',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }
}

