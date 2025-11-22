<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserReputation;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get user profile with reputation
     */
    public function show($id)
    {
        $user = User::with(['profile'])->findOrFail($id);
        
        $reputation = UserReputation::firstOrCreate(
            ['user_id' => $id],
            [
                'points' => 0,
                'posts_count' => 0,
                'topics_count' => 0,
                'solutions_count' => 0,
                'helpful_count' => 0,
            ]
        );

        return response()->json([
            'user' => $user,
            'reputation' => [
                'points' => $reputation->points,
                'level' => $reputation->getLevel(),
                'stats' => [
                    'posts' => $reputation->posts_count,
                    'topics' => $reputation->topics_count,
                    'solutions' => $reputation->solutions_count,
                    'helpful' => $reputation->helpful_count,
                ],
            ],
        ]);
    }

    /**
     * Get leaderboard
     */
    public function leaderboard()
    {
        $top = UserReputation::with('user')
            ->orderBy('points', 'desc')
            ->limit(10)
            ->get();

        return response()->json(['leaderboard' => $top]);
    }
}

