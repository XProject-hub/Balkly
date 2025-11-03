<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'reviewer_id',
        'reviewed_user_id',
        'listing_id',
        'rating',
        'comment',
        'status',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewedUser()
    {
        return $this->belongsTo(User::class, 'reviewed_user_id');
    }

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}

