<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Listing;
use App\Models\Order;
use App\Models\Event;
use App\Models\ForumTopic;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Admin dashboard stats
     */
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'new_users_today' => User::whereDate('created_at', today())->count(),
            'active_listings' => Listing::where('status', 'active')->count(),
            'pending_moderation' => Listing::where('status', 'pending_review')->count(),
            'total_orders' => Order::count(),
            'orders_today' => Order::whereDate('created_at', today())->count(),
            'revenue_month' => Order::where('status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->sum('total'),
            'revenue_today' => Order::where('status', 'paid')
                ->whereDate('created_at', today())
                ->sum('total'),
            'active_events' => Event::where('status', 'published')->count(),
            'forum_topics' => ForumTopic::count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
        ];

        // Recent users
        $recentUsers = User::with('profile')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        // Recent orders
        $recentOrders = Order::with(['buyer', 'items'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_users' => $recentUsers,
            'recent_orders' => $recentOrders,
        ]);
    }

    /**
     * Get moderation queue
     */
    public function moderationQueue(Request $request)
    {
        $type = $request->get('type', 'all'); // all, listings, forum, events

        $query = Listing::where('status', 'pending_review')
            ->with(['user', 'category', 'media'])
            ->orderBy('created_at', 'asc');

        if ($type !== 'all') {
            // Filter by type if needed
        }

        $items = $query->paginate(20);

        return response()->json($items);
    }

    /**
     * Approve content
     */
    public function approve(Request $request)
    {
        $request->validate([
            'type' => 'required|in:listing,forum_topic,event',
            'id' => 'required|integer',
        ]);

        switch ($request->type) {
            case 'listing':
                $item = Listing::findOrFail($request->id);
                $item->update([
                    'status' => 'active',
                    'published_at' => now(),
                ]);
                break;
            
            case 'forum_topic':
                $item = ForumTopic::findOrFail($request->id);
                $item->update(['status' => 'active']);
                break;
            
            case 'event':
                $item = Event::findOrFail($request->id);
                $item->update(['status' => 'published']);
                break;
        }

        return response()->json([
            'message' => 'Content approved successfully',
            'item' => $item,
        ]);
    }

    /**
     * Reject content
     */
    public function reject(Request $request)
    {
        $request->validate([
            'type' => 'required|in:listing,forum_topic,event',
            'id' => 'required|integer',
            'reason' => 'nullable|string',
        ]);

        switch ($request->type) {
            case 'listing':
                $item = Listing::findOrFail($request->id);
                $item->update(['status' => 'rejected']);
                break;
            
            case 'forum_topic':
                $item = ForumTopic::findOrFail($request->id);
                $item->update(['status' => 'deleted']);
                break;
            
            case 'event':
                $item = Event::findOrFail($request->id);
                $item->update(['status' => 'cancelled']);
                break;
        }

        return response()->json([
            'message' => 'Content rejected successfully',
        ]);
    }

    /**
     * Platform analytics
     */
    public function analytics(Request $request)
    {
        $period = $request->get('period', '30'); // days

        $analytics = [
            'funnel' => [
                'visitors' => 15420,
                'searches' => 8234,
                'views' => 12543,
                'messages' => 3421,
                'checkouts' => 567,
                'paid' => 432,
            ],
            'revenue' => [
                'listing_fees' => Order::where('status', 'paid')
                    ->whereHas('items', function ($q) {
                        $q->where('item_type', 'listing_plan');
                    })
                    ->sum('total'),
                'ticket_fees' => Order::where('status', 'paid')
                    ->whereHas('items', function ($q) {
                        $q->where('item_type', 'ticket');
                    })
                    ->sum('total'),
                'sticky_fees' => Order::where('status', 'paid')
                    ->whereHas('items', function ($q) {
                        $q->where('item_type', 'forum_sticky');
                    })
                    ->sum('total'),
            ],
            'listings_by_category' => Listing::select('category_id', DB::raw('count(*) as count'))
                ->where('status', 'active')
                ->groupBy('category_id')
                ->with('category')
                ->get(),
            'orders_by_day' => Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count'),
                DB::raw('sum(total) as revenue')
            )
                ->where('created_at', '>=', now()->subDays($period))
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ];

        return response()->json($analytics);
    }

    /**
     * Manage users
     */
    public function users(Request $request)
    {
        $query = User::with('profile');

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json($users);
    }

    /**
     * Ban user
     */
    public function banUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'admin') {
            return response()->json(['error' => 'Cannot ban admin users'], 403);
        }

        $user->delete(); // Soft delete

        return response()->json(['message' => 'User banned successfully']);
    }

    /**
     * Permanently delete user
     */
    public function deleteUser($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        
        if ($user->role === 'admin') {
            return response()->json(['error' => 'Cannot delete admin users'], 403);
        }

        // Permanently delete
        $user->forceDelete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Manually verify user email (admin only)
     */
    public function verifyUserEmail($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'User email is already verified'], 200);
        }

        $user->email_verified_at = now();
        $user->save();

        return response()->json([
            'message' => 'User email verified successfully',
            'user' => $user,
        ]);
    }
}

