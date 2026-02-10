<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Get current user profile
     */
    public function show(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'user' => $user->load('profile'),
        ]);
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|size:2',
            'bio' => 'nullable|string|max:500',
            'avatar_url' => 'nullable|url',
            'company_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        // Update user name if provided
        if (isset($validated['name'])) {
            $user->update(['name' => $validated['name']]);
            unset($validated['name']);
        }

        // Update profile
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'user' => $user->load('profile'),
            'message' => 'Profile updated successfully',
        ]);
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:5120', // 5MB max
        ]);

        $user = $request->user();
        $file = $request->file('avatar');

        // Generate unique filename
        $filename = 'avatar_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();

        // Store in MinIO/S3
        $path = $file->storeAs('avatars', $filename, 'public');
        
        // Get the full URL
        $avatarUrl = config('app.url') . '/storage/' . $path;

        // Update profile
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            ['avatar_url' => $avatarUrl]
        );

        return response()->json([
            'avatar_url' => $avatarUrl,
            'message' => 'Avatar uploaded successfully',
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        $user = $request->user();

        // Verify current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
            ], 400);
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        // Revoke all other tokens for security
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return response()->json([
            'message' => 'Password changed successfully',
        ]);
    }

    /**
     * Get user insights/analytics
     */
    public function insights(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_views' => $user->listings()->sum('views_count'),
            'total_listings' => $user->listings()->count(),
            'active_listings' => $user->listings()->where('status', 'active')->count(),
            'total_messages' => $user->chatsAsBuyer()->count() + $user->chatsAsSeller()->count(),
            'total_orders' => $user->orders()->count(),
        ];

        return response()->json([
            'insights' => $stats,
        ]);
    }
}

