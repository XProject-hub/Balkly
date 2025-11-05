<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OnlineUsersController extends php
{
    /**
     * Track user activity
     */
    public function track(Request $request)
    {
        $sessionId = session()->getId();
        
        DB::table('online_users')->updateOrInsert(
            ['session_id' => $sessionId],
            [
                'user_id' => auth()->id(),
                'ip_address' => $request->ip(),
                'page_url' => $request->input('page_url'),
                'last_activity' => now(),
                'updated_at' => now(),
            ]
        );

        return response()->json(['tracked' => true]);
    }

    /**
     * Get online users count
     */
    public function count()
    {
        // Consider users online if active in last 5 minutes
        $total = DB::table('online_users')
            ->where('last_activity', '>=', now()->subMinutes(5))
            ->count();

        $registered = DB::table('online_users')
            ->whereNotNull('user_id')
            ->where('last_activity', '>=', now()->subMinutes(5))
            ->count();

        $guests = $total - $registered;

        return response()->json([
            'total' => $total,
            'registered' => $registered,
            'guests' => $guests,
        ]);
    }

    /**
     * Cleanup old sessions (run via cron)
     */
    public function cleanup()
    {
        DB::table('online_users')
            ->where('last_activity', '<', now()->subHour())
            ->delete();

        return response()->json(['cleaned' => true]);
    }
}

