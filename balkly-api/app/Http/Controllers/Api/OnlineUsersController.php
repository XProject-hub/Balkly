<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OnlineUsersController extends Controller
{
    /**
     * Track user activity
     */
    public function track(Request $request)
    {
        // DISABLED - causing 500 errors
        // Will re-enable once table structure is fixed
        return response()->json(['tracked' => true]);
    }

    /**
     * Get online users count
     */
    public function count()
    {
        // DISABLED - return dummy data for now
        return response()->json([
            'total' => 0,
            'registered' => 0,
            'guests' => 0,
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

