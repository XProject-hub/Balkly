<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageVisit;
use App\Models\User;
use App\Models\Listing;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Track page visit
     */
    public function trackVisit(Request $request)
    {
        $request->validate([
            'page_url' => 'required|string',
            'page_title' => 'nullable|string',
            'time_on_page' => 'nullable|integer',
        ]);

        // Get real IP from headers (for proxies/nginx)
        $realIp = $request->header('X-Forwarded-For') 
                  ? explode(',', $request->header('X-Forwarded-For'))[0]
                  : $request->ip();

        PageVisit::create([
            'user_id' => auth()->id(),
            'page_url' => $request->page_url,
            'page_title' => $request->page_title,
            'referrer' => $request->header('referer'),
            'ip_address' => $realIp,
            'user_agent' => $request->userAgent(),
            'device_type' => $this->detectDeviceType($request->userAgent()),
            'browser' => $this->detectBrowser($request->userAgent()),
            'time_on_page' => $request->time_on_page ?? 0,
            'visited_at' => now(),
        ]);

        return response()->json(['tracked' => true]);
    }

    /**
     * Get comprehensive analytics (Admin only)
     */
    public function getAnalytics(Request $request)
    {
        $period = $request->get('period', 30); // days

        $analytics = [
            // Website traffic
            'traffic' => [
                'total_visits' => PageVisit::where('visited_at', '>=', now()->subDays($period))->count(),
                'unique_visitors' => PageVisit::where('visited_at', '>=', now()->subDays($period))
                    ->distinct('ip_address')->count('ip_address'),
                'avg_time_on_site' => PageVisit::where('visited_at', '>=', now()->subDays($period))
                    ->avg('time_on_page'),
                'bounce_rate' => $this->calculateBounceRate($period),
                'visits_by_day' => PageVisit::select(
                        DB::raw('DATE(visited_at) as date'),
                        DB::raw('count(*) as visits'),
                        DB::raw('count(distinct ip_address) as unique_visitors')
                    )
                    ->where('visited_at', '>=', now()->subDays($period))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
            ],

            // Device breakdown
            'devices' => PageVisit::select('device_type', DB::raw('count(*) as count'))
                ->where('visited_at', '>=', now()->subDays($period))
                ->groupBy('device_type')
                ->get(),

            // Top pages
            'top_pages' => PageVisit::select('page_url', 'page_title', DB::raw('count(*) as visits'))
                ->where('visited_at', '>=', now()->subDays($period))
                ->groupBy('page_url', 'page_title')
                ->orderByDesc('visits')
                ->take(10)
                ->get(),

            // User metrics
            'users' => [
                'total' => User::count(),
                'new_today' => User::whereDate('created_at', today())->count(),
                'new_this_week' => User::where('created_at', '>=', now()->subWeek())->count(),
                'new_this_month' => User::where('created_at', '>=', now()->subMonth())->count(),
                'verified' => User::whereNotNull('email_verified_at')->count(),
                'with_2fa' => User::whereNotNull('twofa_secret')->count(),
            ],

            // Listings metrics
            'listings' => [
                'total' => Listing::count(),
                'active' => Listing::where('status', 'active')->count(),
                'pending' => Listing::where('status', 'pending_review')->count(),
                'by_category' => Listing::select('category_id', DB::raw('count(*) as count'))
                    ->groupBy('category_id')
                    ->with('category:id,name')
                    ->get(),
            ],

            // Revenue metrics
            'revenue' => [
                'total_all_time' => Order::where('status', 'paid')->sum('total'),
                'today' => Order::where('status', 'paid')->whereDate('created_at', today())->sum('total'),
                'this_week' => Order::where('status', 'paid')
                    ->where('created_at', '>=', now()->subWeek())->sum('total'),
                'this_month' => Order::where('status', 'paid')
                    ->where('created_at', '>=', now()->subMonth())->sum('total'),
                'by_type' => Order::select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('sum(total) as revenue')
                    )
                    ->where('status', 'paid')
                    ->where('created_at', '>=', now()->subDays($period))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
            ],

            // Conversion funnel
            'funnel' => [
                'visits' => PageVisit::where('visited_at', '>=', now()->subDays($period))->count(),
                'registrations' => User::where('created_at', '>=', now()->subDays($period))->count(),
                'listings_created' => Listing::where('created_at', '>=', now()->subDays($period))->count(),
                'orders' => Order::where('created_at', '>=', now()->subDays($period))->count(),
                'paid_orders' => Order::where('status', 'paid')
                    ->where('created_at', '>=', now()->subDays($period))->count(),
            ],
        ];

        return response()->json($analytics);
    }

    /**
     * Calculate bounce rate
     */
    protected function calculateBounceRate($period)
    {
        $totalSessions = PageVisit::where('visited_at', '>=', now()->subDays($period))
            ->distinct('ip_address')
            ->count('ip_address');

        $bounces = PageVisit::select('ip_address')
            ->where('visited_at', '>=', now()->subDays($period))
            ->groupBy('ip_address')
            ->having(DB::raw('count(*)'), '=', 1)
            ->get()
            ->count();

        return $totalSessions > 0 ? round(($bounces / $totalSessions) * 100, 2) : 0;
    }

    /**
     * Detect device type from user agent
     */
    protected function detectDeviceType($userAgent)
    {
        if (preg_match('/mobile/i', $userAgent)) {
            return 'mobile';
        } elseif (preg_match('/tablet|ipad/i', $userAgent)) {
            return 'tablet';
        }
        return 'desktop';
    }

    /**
     * Detect browser from user agent
     */
    protected function detectBrowser($userAgent)
    {
        if (preg_match('/Chrome/i', $userAgent)) return 'Chrome';
        if (preg_match('/Firefox/i', $userAgent)) return 'Firefox';
        if (preg_match('/Safari/i', $userAgent)) return 'Safari';
        if (preg_match('/Edge/i', $userAgent)) return 'Edge';
        if (preg_match('/Opera/i', $userAgent)) return 'Opera';
        return 'Other';
    }
}

