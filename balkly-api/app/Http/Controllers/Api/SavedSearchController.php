<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedSearch;
use Illuminate\Http\Request;

class SavedSearchController extends Controller
{
    /**
     * Get user's saved searches
     */
    public function index()
    {
        $searches = SavedSearch::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['searches' => $searches]);
    }

    /**
     * Save a search
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'search_params' => 'required|array',
            'alert_enabled' => 'boolean',
            'alert_frequency' => 'in:daily,weekly',
        ]);

        $search = SavedSearch::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'search_params' => $validated['search_params'],
            'alert_enabled' => $validated['alert_enabled'] ?? false,
            'alert_frequency' => $validated['alert_frequency'] ?? 'daily',
        ]);

        return response()->json(['search' => $search], 201);
    }

    /**
     * Update saved search
     */
    public function update(Request $request, $id)
    {
        $search = SavedSearch::where('user_id', auth()->id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'alert_enabled' => 'boolean',
            'alert_frequency' => 'in:daily,weekly',
        ]);

        $search->update($validated);

        return response()->json(['search' => $search]);
    }

    /**
     * Delete saved search
     */
    public function destroy($id)
    {
        SavedSearch::where('user_id', auth()->id())
            ->where('id', $id)
            ->delete();

        return response()->json(['message' => 'Search deleted']);
    }
}

