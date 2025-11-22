<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get user's notifications
     */
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($notifications);
    }

    /**
     * Get unread count
     */
    public function unreadCount()
    {
        $count = $this->notificationService->getUnreadCount(auth()->id());
        
        return response()->json([
            'count' => $count,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', auth()->id())
            ->findOrFail($id);
        
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Mark all as read
     */
    public function markAllAsRead()
    {
        $this->notificationService->markAllAsRead(auth()->id());

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Delete notification
     */
    public function destroy($id)
    {
        $notification = Notification::where('user_id', auth()->id())
            ->findOrFail($id);
        
        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted',
        ]);
    }
}

