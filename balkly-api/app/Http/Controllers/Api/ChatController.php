<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\Message;
use App\Models\Listing;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();

        $chats = Chat::where(function($query) use ($userId) {
            $query->where('buyer_id', $userId)
                  ->orWhere('seller_id', $userId);
        })
        ->with(['listing', 'buyer', 'seller', 'lastMessage'])
        ->orderBy('last_message_at', 'desc')
        ->paginate(20);

        return response()->json($chats);
    }

    public function start($listingId)
    {
        $listing = Listing::findOrFail($listingId);

        if ($listing->user_id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot chat with yourself',
            ], 400);
        }

        $chat = Chat::firstOrCreate(
            [
                'listing_id' => $listingId,
                'buyer_id' => auth()->id(),
            ],
            [
                'seller_id' => $listing->user_id,
                'last_message_at' => now(),
            ]
        );

        return response()->json([
            'chat' => $chat->load(['listing', 'buyer', 'seller']),
        ]);
    }

    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'chat_id' => 'required|exists:chats,id',
            'body' => 'required|string',
            'attachments' => 'nullable|array',
        ]);

        $chat = Chat::findOrFail($validated['chat_id']);

        // Verify user is part of chat
        if ($chat->buyer_id !== auth()->id() && $chat->seller_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $message = Message::create([
            'chat_id' => $validated['chat_id'],
            'sender_id' => auth()->id(),
            'body' => $validated['body'],
            'attachments_json' => $validated['attachments'] ?? null,
        ]);

        // Update chat last message time
        $chat->update(['last_message_at' => now()]);

        return response()->json([
            'message' => $message->load('sender'),
        ], 201);
    }
}

