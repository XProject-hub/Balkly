<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Get reviews for a user
     */
    public function getUserReviews($userId)
    {
        $reviews = Review::where('reviewed_user_id', $userId)
            ->where('status', 'approved')
            ->with(['reviewer', 'listing'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $avgRating = Review::where('reviewed_user_id', $userId)
            ->where('status', 'approved')
            ->avg('rating');

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($avgRating, 1),
            'total_reviews' => $reviews->total(),
        ]);
    }

    /**
     * Create review
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reviewed_user_id' => 'required|exists:users,id',
            'listing_id' => 'nullable|exists:listings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Can't review yourself
        if ($validated['reviewed_user_id'] == auth()->id()) {
            return response()->json(['error' => 'Cannot review yourself'], 400);
        }

        $review = Review::create([
            'reviewer_id' => auth()->id(),
            'reviewed_user_id' => $validated['reviewed_user_id'],
            'listing_id' => $validated['listing_id'] ?? null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json(['review' => $review], 201);
    }
}

