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
        $favorites = Favorite::where('user_id', auth()->id())
            ->with('favoritable')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($favorites);
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

