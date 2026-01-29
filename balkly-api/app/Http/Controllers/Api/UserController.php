<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserReputation;
use App\Models\Profile;
use App\Models\Listing;
use App\Models\ForumPost;
use App\Models\ForumTopic;
use App\Models\Review;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get user profile with reputation
     */
    public function show($id)
    {
        $user = User::with(['profile'])->find($id);
        
        if (!$user) {
            return response()->json([
                'error' => 'User not found',
                'message' => 'The user you are looking for does not exist.'
            ], 404);
        }

        // Create profile if it doesn't exist
        if (!$user->profile) {
            $user->profile()->create([
                'bio' => null,
                'avatar_url' => null,
                'phone' => null,
                'company_name' => null,
            ]);
            $user->load('profile');
        }
        
        // Get or create reputation
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

        // Get additional stats
        $listingsCount = Listing::where('user_id', $id)->count();
        $activeListingsCount = Listing::where('user_id', $id)->where('status', 'active')->count();
        $forumPostsCount = ForumPost::where('user_id', $id)->count();
        $forumTopicsCount = ForumTopic::where('user_id', $id)->count();
        
        // Get reviews received (as seller)
        $reviewsReceived = Review::whereHas('listing', function($q) use ($id) {
            $q->where('user_id', $id);
        })->count();
        
        $avgRating = Review::whereHas('listing', function($q) use ($id) {
            $q->where('user_id', $id);
        })->avg('rating');

        $level = $reputation->getLevel();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'profile' => $user->profile ? [
                    'bio' => $user->profile->bio,
                    'location' => $user->profile->city ? ($user->profile->city . ($user->profile->country ? ', ' . $user->profile->country : '')) : $user->profile->country,
                    'phone' => $user->profile->phone,
                    'avatar_url' => $user->profile->avatar_url,
                    'company_name' => $user->profile->company_name,
                ] : null,
            ],
            'reputation' => [
                'points' => $reputation->points,
                'level' => $level['name'] ?? 'Newbie',
                'level_color' => $level['color'] ?? 'gray',
                'stats' => [
                    'posts' => $reputation->posts_count,
                    'topics' => $reputation->topics_count,
                    'solutions' => $reputation->solutions_count,
                    'helpful' => $reputation->helpful_count,
                ],
            ],
            'activity' => [
                'total_listings' => $listingsCount,
                'active_listings' => $activeListingsCount,
                'forum_posts' => $forumPostsCount,
                'forum_topics' => $forumTopicsCount,
                'reviews_received' => $reviewsReceived,
                'avg_rating' => $avgRating ? round($avgRating, 1) : null,
            ],
            'member_since' => $user->created_at->format('F Y'),
            'is_verified' => $user->email_verified_at !== null,
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
            ->get()
            ->map(function ($rep) {
                $level = $rep->getLevel();
                return [
                    'user' => [
                        'id' => $rep->user->id,
                        'name' => $rep->user->name,
                    ],
                    'points' => $rep->points,
                    'level' => $level['name'] ?? 'Newbie',
                    'level_color' => $level['color'] ?? 'gray',
                ];
            });

        return response()->json(['leaderboard' => $top]);
    }
}

