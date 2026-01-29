<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageVisit;
use App\Models\User;
use App\Models\Listing;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Event;
use App\Models\ForumTopic;
use App\Models\ForumPost;
use App\Models\Message;
use App\Models\Review;
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
        try {
            $period = $request->get('period', 30); // days
            $startDate = now()->subDays($period);

            $analytics = [
            // Website traffic - ALL REAL DATA
            'traffic' => [
                'total_visits' => PageVisit::where('visited_at', '>=', $startDate)->count(),
                'unique_visitors' => PageVisit::where('visited_at', '>=', $startDate)
                    ->distinct('ip_address')->count('ip_address'),
                'avg_time_on_site' => round(PageVisit::where('visited_at', '>=', $startDate)
                    ->avg('time_on_page') ?: 0),
                'bounce_rate' => $this->calculateBounceRate($period),
                'page_views_per_session' => $this->calculatePageViewsPerSession($period),
                'visits_by_day' => PageVisit::select(
                        DB::raw('DATE(visited_at) as date'),
                        DB::raw('count(*) as visits'),
                        DB::raw('count(distinct ip_address) as unique_visitors'),
                        DB::raw('avg(time_on_page) as avg_time')
                    )
                    ->where('visited_at', '>=', $startDate)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
                'users_by_day' => User::select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('count(*) as count')
                    )
                    ->where('created_at', '>=', $startDate)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
                'listings_by_day' => Listing::select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('count(*) as count')
                    )
                    ->where('created_at', '>=', $startDate)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
                'orders_by_day' => Order::select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('count(*) as count'),
                        DB::raw('sum(total) as revenue')
                    )
                    ->where('created_at', '>=', $startDate)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
            ],

            // Device breakdown
            'devices' => PageVisit::select('device_type', DB::raw('count(*) as count'))
                ->where('visited_at', '>=', $startDate)
                ->groupBy('device_type')
                ->get(),

            // Browser breakdown
            'browsers' => PageVisit::select('browser', DB::raw('count(*) as count'))
                ->where('visited_at', '>=', $startDate)
                ->whereNotNull('browser')
                ->groupBy('browser')
                ->orderByDesc('count')
                ->take(6)
                ->get(),

            // Top referrers
            'referrers' => PageVisit::select('referrer', DB::raw('count(*) as count'))
                ->where('visited_at', '>=', $startDate)
                ->whereNotNull('referrer')
                ->where('referrer', '!=', '')
                ->groupBy('referrer')
                ->orderByDesc('count')
                ->take(10)
                ->get()
                ->map(function ($item) {
                    // Parse referrer URL to get domain
                    $parsed = parse_url($item->referrer);
                    return [
                        'source' => $parsed['host'] ?? $item->referrer,
                        'full_url' => $item->referrer,
                        'count' => $item->count,
                    ];
                }),

            // Top pages - group by title only to avoid duplicates
            'top_pages' => PageVisit::select('page_title', 'page_url', DB::raw('count(*) as visits'))
                ->where('visited_at', '>=', $startDate)
                ->whereNotNull('page_title')
                ->groupBy('page_title', 'page_url')
                ->orderByDesc('visits')
                ->take(15)
                ->get(),

            // User metrics
            'users' => [
                'total' => User::count(),
                'new_today' => User::whereDate('created_at', today())->count(),
                'new_this_week' => User::where('created_at', '>=', now()->subWeek())->count(),
                'new_this_month' => User::where('created_at', '>=', now()->subMonth())->count(),
                'new_in_period' => User::where('created_at', '>=', $startDate)->count(),
                'verified' => User::whereNotNull('email_verified_at')->count(),
                'with_2fa' => User::whereNotNull('twofa_secret')->count(),
                'active_sellers' => User::whereHas('listings', function($q) {
                    $q->where('status', 'active');
                })->count(),
                'growth_rate' => $this->calculateGrowthRate('users', $period),
            ],

            // Listings metrics
            'listings' => [
                'total' => Listing::count(),
                'active' => Listing::where('status', 'active')->count(),
                'pending' => Listing::where('status', 'pending_review')->count(),
                'sold' => Listing::where('status', 'sold')->count(),
                'new_in_period' => Listing::where('created_at', '>=', $startDate)->count(),
                'by_category' => Listing::select('category_id', DB::raw('count(*) as count'))
                    ->groupBy('category_id')
                    ->with('category:id,name,icon')
                    ->get(),
                'growth_rate' => $this->calculateGrowthRate('listings', $period),
            ],

            // Revenue metrics - COMPLETE BREAKDOWN
            'revenue' => [
                'total_all_time' => (float) Order::where('status', 'paid')->sum('total'),
                'today' => (float) Order::where('status', 'paid')->whereDate('created_at', today())->sum('total'),
                'this_week' => (float) Order::where('status', 'paid')
                    ->where('created_at', '>=', now()->subWeek())->sum('total'),
                'this_month' => (float) Order::where('status', 'paid')
                    ->where('created_at', '>=', now()->subMonth())->sum('total'),
                'in_period' => (float) Order::where('status', 'paid')
                    ->where('created_at', '>=', $startDate)->sum('total'),
                // Revenue by type breakdown
                'listing_fees' => (float) Order::where('status', 'paid')
                    ->whereHas('items', function ($q) {
                        $q->where('item_type', 'listing_plan');
                    })->sum('total'),
                'sticky_fees' => (float) Order::where('status', 'paid')
                    ->whereHas('items', function ($q) {
                        $q->where('item_type', 'forum_sticky');
                    })->sum('total'),
                'ticket_fees' => (float) Order::where('status', 'paid')
                    ->whereHas('items', function ($q) {
                        $q->where('item_type', 'ticket');
                    })->sum('total'),
                'other_fees' => (float) Order::where('status', 'paid')
                    ->whereHas('items', function ($q) {
                        $q->whereNotIn('item_type', ['listing_plan', 'forum_sticky', 'ticket']);
                    })->sum('total'),
                'by_type' => Order::select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('sum(total) as revenue'),
                        DB::raw('count(*) as orders')
                    )
                    ->where('status', 'paid')
                    ->where('created_at', '>=', $startDate)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
                'avg_order_value' => round((float) Order::where('status', 'paid')
                    ->where('created_at', '>=', $startDate)->avg('total') ?: 0, 2),
                'growth_rate' => $this->calculateGrowthRate('revenue', $period),
            ],

            // Orders metrics
            'orders' => [
                'total' => Order::count(),
                'paid' => Order::where('status', 'paid')->count(),
                'pending' => Order::where('status', 'pending')->count(),
                'in_period' => Order::where('created_at', '>=', $startDate)->count(),
                'paid_in_period' => Order::where('status', 'paid')
                    ->where('created_at', '>=', $startDate)->count(),
                'conversion_rate' => $this->calculateOrderConversionRate($period),
            ],

            // Conversion funnel
            'funnel' => [
                'visits' => PageVisit::where('visited_at', '>=', $startDate)->count(),
                'unique_visitors' => PageVisit::where('visited_at', '>=', $startDate)
                    ->distinct('ip_address')->count('ip_address'),
                'registrations' => User::where('created_at', '>=', $startDate)->count(),
                'listings_created' => Listing::where('created_at', '>=', $startDate)->count(),
                'orders' => Order::where('created_at', '>=', $startDate)->count(),
                'paid_orders' => Order::where('status', 'paid')
                    ->where('created_at', '>=', $startDate)->count(),
            ],

            // Platform activity
            'activity' => [
                'total_messages' => Message::count(),
                'messages_in_period' => Message::where('created_at', '>=', $startDate)->count(),
                'total_reviews' => Review::count(),
                'reviews_in_period' => Review::where('created_at', '>=', $startDate)->count(),
                'forum_topics' => ForumTopic::count(),
                'forum_topics_in_period' => ForumTopic::where('created_at', '>=', $startDate)->count(),
                'forum_posts' => ForumPost::count(),
                'forum_posts_in_period' => ForumPost::where('created_at', '>=', $startDate)->count(),
                'events_total' => Event::count(),
                'events_active' => Event::where('status', 'published')
                    ->where('date', '>=', now())->count(),
            ],

            // Peak hours analysis
            'peak_hours' => PageVisit::select(
                    DB::raw('HOUR(visited_at) as hour'),
                    DB::raw('count(*) as visits')
                )
                ->where('visited_at', '>=', $startDate)
                ->groupBy('hour')
                ->orderBy('hour')
                ->get(),

            // Day of week analysis
            'day_of_week' => PageVisit::select(
                    DB::raw('DAYOFWEEK(visited_at) as day'),
                    DB::raw('count(*) as visits')
                )
                ->where('visited_at', '>=', $startDate)
                ->groupBy('day')
                ->orderBy('day')
                ->get(),
        ];

            return response()->json($analytics);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to load analytics',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Calculate page views per session
     */
    protected function calculatePageViewsPerSession($period)
    {
        $totalVisits = PageVisit::where('visited_at', '>=', now()->subDays($period))->count();
        $uniqueSessions = PageVisit::where('visited_at', '>=', now()->subDays($period))
            ->distinct('ip_address')
            ->count('ip_address');

        return $uniqueSessions > 0 ? round($totalVisits / $uniqueSessions, 1) : 0;
    }

    /**
     * Calculate growth rate compared to previous period
     */
    protected function calculateGrowthRate($type, $period)
    {
        $currentStart = now()->subDays($period);
        $previousStart = now()->subDays($period * 2);
        $previousEnd = now()->subDays($period);

        switch ($type) {
            case 'users':
                $current = User::where('created_at', '>=', $currentStart)->count();
                $previous = User::whereBetween('created_at', [$previousStart, $previousEnd])->count();
                break;
            case 'listings':
                $current = Listing::where('created_at', '>=', $currentStart)->count();
                $previous = Listing::whereBetween('created_at', [$previousStart, $previousEnd])->count();
                break;
            case 'revenue':
                $current = Order::where('status', 'paid')->where('created_at', '>=', $currentStart)->sum('total');
                $previous = Order::where('status', 'paid')->whereBetween('created_at', [$previousStart, $previousEnd])->sum('total');
                break;
            default:
                return 0;
        }

        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * Calculate order conversion rate
     */
    protected function calculateOrderConversionRate($period)
    {
        $totalOrders = Order::where('created_at', '>=', now()->subDays($period))->count();
        $paidOrders = Order::where('status', 'paid')
            ->where('created_at', '>=', now()->subDays($period))->count();

        return $totalOrders > 0 ? round(($paidOrders / $totalOrders) * 100, 1) : 0;
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

