<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Get user's favorites
     */
    public function index()
    {
        try {
            $favorites = Favorite::where('user_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get();
            
            // Manually load favoritable items
            $favorites->each(function($favorite) {
                if ($favorite->favoritable_type === 'App\\Models\\Listing') {
                    $favorite->favoritable = \App\Models\Listing::find($favorite->favoritable_id);
                } elseif ($favorite->favoritable_type === 'App\\Models\\Event') {
                    $favorite->favoritable = \App\Models\Event::find($favorite->favoritable_id);
                }
            });

            return response()->json(['data' => $favorites]);
        } catch (\Exception $e) {
            \Log::error('Favorites error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Add to favorites
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'favoritable_type' => 'required|string',
            'favoritable_id' => 'required|integer',
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id' => auth()->id(),
            'favoritable_type' => $validated['favoritable_type'],
            'favoritable_id' => $validated['favoritable_id'],
        ]);

        return response()->json(['favorite' => $favorite], 201);
    }

    /**
     * Remove from favorites
     */
    public function destroy($id)
    {
        Favorite::where('user_id', auth()->id())
            ->where('id', $id)
            ->delete();

        return response()->json(['message' => 'Removed from favorites']);
    }

    /**
     * Check if favorited
     */
    public function check(Request $request)
    {
        $validated = $request->validate([
            'favoritable_type' => 'required|string',
            'favoritable_id' => 'required|integer',
        ]);

        $exists = Favorite::where('user_id', auth()->id())
            ->where('favoritable_type', $validated['favoritable_type'])
            ->where('favoritable_id', $validated['favoritable_id'])
            ->exists();

        return response()->json(['is_favorited' => $exists]);
    }
}

