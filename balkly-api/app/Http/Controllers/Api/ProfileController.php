<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|size:2',
            'bio' => 'nullable|string|max:500',
            'avatar_url' => 'nullable|url',
            'company_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
        ]);

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

