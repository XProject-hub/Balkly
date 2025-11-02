<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'avatar_url',
        'phone',
        'company_name',
        'vat_id',
        'address',
        'city',
        'country',
        'social_links',
        'bio',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

