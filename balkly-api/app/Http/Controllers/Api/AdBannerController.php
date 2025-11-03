<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdBanner;
use Illuminate\Http\Request;

class AdBannerController extends Controller
{
    /**
     * Get active banners for a position
     */
    public function getByPosition(Request $request, $position)
    {
        $banners = AdBanner::active()
            ->where('position', $position)
            ->orderBy('display_order')
            ->get();

        return response()->json(['banners' => $banners]);
    }

    /**
     * Track banner impression
     */
    public function trackImpression($id)
    {
        $banner = AdBanner::findOrFail($id);
        $banner->incrementImpressions();

        return response()->json(['tracked' => true]);
    }

    /**
     * Track banner click
     */
    public function trackClick($id)
    {
        $banner = AdBanner::findOrFail($id);
        $banner->incrementClicks();

        return response()->json([
            'tracked' => true,
            'redirect_url' => $banner->link_url,
        ]);
    }

    /**
     * Get all banners (Admin)
     */
    public function index()
    {
        $banners = AdBanner::orderBy('position')->orderBy('display_order')->get();
        return response()->json(['banners' => $banners]);
    }

    /**
     * Create banner (Admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'position' => 'required|string',
            'type' => 'required|in:image,html,video',
            'image_url' => 'nullable|url',
            'html_content' => 'nullable|string',
            'link_url' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $banner = AdBanner::create($validated);

        return response()->json(['banner' => $banner], 201);
    }

    /**
     * Update banner (Admin)
     */
    public function update(Request $request, $id)
    {
        $banner = AdBanner::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'position' => 'sometimes|string',
            'image_url' => 'nullable|url',
            'html_content' => 'nullable|string',
            'link_url' => 'nullable|url',
            'is_active' => 'sometimes|boolean',
        ]);

        $banner->update($validated);

        return response()->json(['banner' => $banner]);
    }

    /**
     * Delete banner (Admin)
     */
    public function destroy($id)
    {
        AdBanner::findOrFail($id)->delete();
        return response()->json(['message' => 'Banner deleted']);
    }
}

