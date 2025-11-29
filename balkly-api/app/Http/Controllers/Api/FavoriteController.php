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
            
            // Load favoritable items with full data
            $result = $favorites->map(function($favorite) {
                $item = null;
                
                if ($favorite->favoritable_type === 'App\\Models\\Listing') {
                    $item = \App\Models\Listing::with(['user', 'category', 'media'])
                        ->find($favorite->favoritable_id);
                } elseif ($favorite->favoritable_type === 'App\\Models\\Event') {
                    $item = \App\Models\Event::find($favorite->favoritable_id);
                }
                
                return [
                    'id' => $favorite->id,
                    'favoritable_type' => $favorite->favoritable_type,
                    'favoritable_id' => $favorite->favoritable_id,
                    'favoritable' => $item,
                    'created_at' => $favorite->created_at,
                ];
            });

            return response()->json(['data' => $result]);
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

