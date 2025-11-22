<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserReputation extends Model
{
    use HasFactory;

    protected $table = 'user_reputation';

    protected $fillable = [
        'user_id',
        'points',
        'posts_count',
        'topics_count',
        'solutions_count',
        'helpful_count',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Add points to user
     */
    public function addPoints($amount, $reason = null)
    {
        $this->increment('points', $amount);
    }

    /**
     * Get reputation level
     */
    public function getLevel()
    {
        $points = $this->points;
        
        if ($points < 50) return ['name' => 'Newbie', 'color' => 'gray'];
        if ($points < 200) return ['name' => 'Member', 'color' => 'blue'];
        if ($points < 500) return ['name' => 'Active', 'color' => 'green'];
        if ($points < 1000) return ['name' => 'Expert', 'color' => 'purple'];
        return ['name' => 'Legend', 'color' => 'gold'];
    }
}

